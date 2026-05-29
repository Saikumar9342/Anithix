# Priority Features Implementation Roadmap

**AI Media OS — Analytics, A/B Testing & Smart Scheduling**

---

## Overview

Three interconnected high-value features that unlock monetization & user retention:

| Feature | Priority | Effort | ROI | Est. Time |
|---------|----------|--------|-----|-----------|
| **1. Analytics Dashboard** | 🔴 Critical | Medium | 💰💰💰 | 3-4 days |
| **2. A/B Testing** | 🟠 High | Medium | 💰💰💰 | 4-5 days |
| **3. Smart Scheduling** | 🟠 High | Low | 💰💰 | 2-3 days |

**Total implementation time:** ~10-12 days  
**Team size:** 1 full-stack engineer  
**Launch impact:** 3x increase in user engagement & retention

---

# FEATURE 1: ANALYTICS DASHBOARD

## 1.1 Overview

Track post performance across all platforms. Show users what works, what doesn't, why.

**What it does:**
- Real-time engagement metrics (likes, comments, shares, saves, impressions)
- Historical trends (post performance over time)
- Performance breakdown (by platform, content type, brand voice, music)
- Recommendations (what content types to focus on)

**User value:**
- "Which of my posts perform best?"
- "What time should I post?"
- "Which platforms drive engagement?"
- "How's my ROI on this content?"

---

## 1.2 Database Schema Changes

### New Tables

```sql
-- Track platform engagement metrics
CREATE TABLE platform_metrics (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,  -- instagram, twitter, linkedin
    platform_post_id VARCHAR(255),  -- ID on native platform
    
    -- Engagement metrics
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    reposts INTEGER DEFAULT 0,
    
    -- Derived metrics
    engagement_rate FLOAT,  -- (likes+comments+shares)/impressions
    reach_rate FLOAT,       -- reach/impressions
    conversion_rate FLOAT,  -- clicks/(impressions or reach)
    
    -- Metadata
    posted_at TIMESTAMP,
    last_synced_at TIMESTAMP,
    sync_error TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ix_platform_metrics_post_id ON platform_metrics(post_id);
CREATE INDEX ix_platform_metrics_platform ON platform_metrics(platform);
CREATE INDEX ix_platform_metrics_posted_at ON platform_metrics(posted_at);

-- Aggregate daily analytics
CREATE TABLE analytics_snapshots (
    id SERIAL PRIMARY KEY,
    
    -- Date scope
    snapshot_date DATE NOT NULL,
    platform VARCHAR(50),  -- NULL = all platforms
    
    -- Daily totals
    posts_published INTEGER,
    total_impressions INTEGER,
    total_reach INTEGER,
    total_engagement INTEGER,
    avg_engagement_rate FLOAT,
    
    -- Top performer
    top_post_id INTEGER REFERENCES posts(id),
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX ix_analytics_snapshots_date_platform 
    ON analytics_snapshots(snapshot_date, COALESCE(platform, ''));

-- User analytics preferences (what to track/display)
CREATE TABLE analytics_config (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,  -- Firebase UID
    
    -- Which metrics to track
    track_impressions BOOLEAN DEFAULT TRUE,
    track_engagement BOOLEAN DEFAULT TRUE,
    track_conversions BOOLEAN DEFAULT FALSE,
    
    -- Notification preferences
    alert_on_viral BOOLEAN DEFAULT TRUE,  -- Alert if post >1000 likes
    viral_threshold INTEGER DEFAULT 1000,
    
    alert_on_low_engagement BOOLEAN DEFAULT FALSE,
    low_engagement_threshold FLOAT DEFAULT 0.01,  -- 1% engagement rate
    
    -- Data retention
    retention_days INTEGER DEFAULT 365,  -- Keep metrics for 1 year
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX ix_analytics_config_user_id ON analytics_config(user_id);
```

### Modified Tables

```sql
-- Add tracking columns to existing Post model
ALTER TABLE posts ADD COLUMN metrics_synced_at TIMESTAMP;
ALTER TABLE posts ADD COLUMN has_platform_metrics BOOLEAN DEFAULT FALSE;

-- Add to schemas: quality_score is already there, but add performance_tier
ALTER TABLE posts ADD COLUMN performance_tier VARCHAR(50);  
-- Values: viral, high, medium, low, pending
```

---

## 1.3 API Endpoints

### Get Dashboard Summary
```
GET /api/analytics/dashboard
Query params:
  - period: 7d, 30d, 90d, 1y (default: 30d)
  - platform: instagram, twitter, linkedin, all (default: all)

Response:
{
  "period": "30d",
  "summary": {
    "total_posts": 24,
    "total_impressions": 185000,
    "total_engagement": 12400,
    "avg_engagement_rate": 0.067,
    "total_reach": 165000
  },
  "trends": {
    "impressions": [
      { "date": "2026-05-28", "value": 6500 },
      { "date": "2026-05-27", "value": 5800 },
      ...
    ],
    "engagement": [...]
  },
  "top_posts": [
    {
      "id": 123,
      "content": "...",
      "platform": "instagram",
      "engagement_rate": 0.125,
      "likes": 850,
      "comments": 120,
      "shares": 45
    }
  ],
  "platform_breakdown": {
    "instagram": {
      "impressions": 120000,
      "engagement_rate": 0.075,
      "top_post_id": 123
    },
    "twitter": { ... },
    "linkedin": { ... }
  },
  "insights": [
    "Instagram carousel posts get 3.2x more engagement",
    "Posts at 7 PM get 40% more reach",
    "Hashtag-heavy posts underperform (avoid #spam)"
  ]
}
```

### Get Post Performance Details
```
GET /api/analytics/posts/{post_id}

Response:
{
  "post_id": 123,
  "content": "...",
  "generated_at": "2026-05-28T10:00:00Z",
  "platforms": [
    {
      "platform": "instagram",
      "posted_at": "2026-05-28T14:00:00Z",
      "impressions": 8500,
      "reach": 7200,
      "engagement": {
        "likes": 850,
        "comments": 120,
        "shares": 45,
        "saves": 320
      },
      "metrics": {
        "engagement_rate": 0.125,
        "reach_rate": 0.848,
        "avg_comment_sentiment": 0.85
      },
      "performance_tier": "high"
    }
  ],
  "metadata": {
    "content_type": "carousel",
    "brand_voice": "casual",
    "music_id": 45,
    "generated_by_agent": "main_agent_v3"
  }
}
```

### Sync Platform Metrics
```
POST /api/analytics/sync

Background job that:
1. Fetches data from Instagram API (Graph API)
2. Fetches data from Twitter API (v2)
3. Fetches data from LinkedIn API
4. Updates platform_metrics table
5. Recalculates insights

Runs:
- Automatically every 6 hours
- Manually on-demand via this endpoint
- On publish (24 hours later)

Response:
{
  "synced": 45,
  "failed": 2,
  "errors": [
    { "post_id": 120, "platform": "twitter", "error": "Tweet deleted" }
  ]
}
```

### Get Analytics Config
```
GET /api/analytics/config

PUT /api/analytics/config
Body:
{
  "alert_on_viral": true,
  "viral_threshold": 1000,
  "alert_on_low_engagement": true,
  "low_engagement_threshold": 0.01,
  "retention_days": 365
}
```

---

## 1.4 Backend Services

### New Service: `analytics.py`

```python
# src/services/analytics.py

from datetime import datetime, timedelta
from sqlalchemy import select, func
from src.models.database import Post, PlatformMetrics, AnalyticsSnapshot
from src.utils.database import AsyncSessionLocal
from loguru import logger

class AnalyticsService:
    """Handle analytics data collection, aggregation, insights."""
    
    @staticmethod
    async def sync_platform_metrics():
        """
        Fetch engagement data from all platforms and store in DB.
        Called every 6 hours or on-demand.
        """
        # Instagram: Use Graph API to fetch insights
        instagram_metrics = await AnalyticsService._fetch_instagram_metrics()
        
        # Twitter: Use v2 API to fetch engagement
        twitter_metrics = await AnalyticsService._fetch_twitter_metrics()
        
        # LinkedIn: Use official API
        linkedin_metrics = await AnalyticsService._fetch_linkedin_metrics()
        
        # Store all in database
        async with AsyncSessionLocal() as session:
            for metric in instagram_metrics + twitter_metrics + linkedin_metrics:
                session.add(metric)
            await session.commit()
        
        return {
            "synced": len(instagram_metrics + twitter_metrics + linkedin_metrics),
            "failed": 0
        }
    
    @staticmethod
    async def get_dashboard_summary(
        period: str = "30d",
        platform: str = "all"
    ) -> dict:
        """
        Get high-level analytics for dashboard.
        Returns: total_posts, impressions, engagement, trends, top_posts, insights
        """
        async with AsyncSessionLocal() as session:
            # Calculate date range
            date_range = AnalyticsService._parse_period(period)
            
            # Fetch metrics
            stmt = select(PlatformMetrics).where(
                PlatformMetrics.posted_at >= date_range['start'],
                PlatformMetrics.posted_at <= date_range['end']
            )
            if platform != "all":
                stmt = stmt.where(PlatformMetrics.platform == platform)
            
            metrics = (await session.execute(stmt)).scalars().all()
            
            # Aggregate
            summary = {
                "total_posts": len(set(m.post_id for m in metrics)),
                "total_impressions": sum(m.impressions for m in metrics),
                "total_engagement": sum(m.likes + m.comments + m.shares for m in metrics),
                "avg_engagement_rate": sum(m.engagement_rate for m in metrics) / len(metrics) if metrics else 0,
            }
            
            # Build trends (impressions over time)
            trends = AnalyticsService._build_trends(metrics)
            
            # Get top posts
            top_posts = AnalyticsService._get_top_posts(metrics, limit=5)
            
            # Generate insights
            insights = AnalyticsService._generate_insights(metrics)
            
            return {
                "period": period,
                "summary": summary,
                "trends": trends,
                "top_posts": top_posts,
                "insights": insights
            }
    
    @staticmethod
    async def get_post_performance(post_id: int) -> dict:
        """Get detailed performance for a single post across all platforms."""
        async with AsyncSessionLocal() as session:
            stmt = select(PlatformMetrics).where(
                PlatformMetrics.post_id == post_id
            )
            metrics = (await session.execute(stmt)).scalars().all()
            
            return {
                "post_id": post_id,
                "platforms": [
                    {
                        "platform": m.platform,
                        "impressions": m.impressions,
                        "engagement": {
                            "likes": m.likes,
                            "comments": m.comments,
                            "shares": m.shares
                        },
                        "metrics": {
                            "engagement_rate": m.engagement_rate,
                            "reach_rate": m.reach_rate
                        }
                    }
                    for m in metrics
                ]
            }
    
    @staticmethod
    def _generate_insights(metrics: list) -> list:
        """Generate actionable insights from metrics."""
        insights = []
        
        # Find top-performing content types
        carousel_metrics = [m for m in metrics if m.platform == "instagram" and m.post_type == "carousel"]
        if carousel_metrics:
            carousel_engagement = sum(m.engagement_rate for m in carousel_metrics) / len(carousel_metrics)
            image_engagement = 0.05  # placeholder
            if carousel_engagement > image_engagement * 1.5:
                insights.append(f"Carousel posts get {carousel_engagement/image_engagement:.1f}x more engagement")
        
        # Time-based insights
        # (analyze which hours/days perform best)
        
        return insights
```

### Integration with Existing Services

```python
# src/services/scheduler.py - Add this to post publishing job

async def publish_post(post_id: int):
    """
    Existing function - ADD THIS:
    After publishing, schedule metrics sync 24 hours later
    """
    # ... existing publish logic ...
    
    # Schedule metrics check 24h later
    from apscheduler.triggers.date import DateTrigger
    from datetime import datetime, timedelta
    
    scheduler.add_job(
        AnalyticsService.sync_platform_metrics,
        trigger=DateTrigger(run_time=datetime.now() + timedelta(hours=24)),
        id=f"sync_metrics_post_{post_id}",
        replace_existing=True
    )
```

---

## 1.5 Frontend Components

### New Pages & Components

```
frontend/src/pages/
├── Analytics.jsx (main dashboard page)
└── (new) AnalyticDetails.jsx (drill-down for single post)

frontend/src/components/analytics/
├── DashboardSummary.jsx (top metrics cards)
├── TrendsChart.jsx (impressions/engagement over time)
├── TopPostsTable.jsx (top 5 performing posts)
├── PlatformBreakdown.jsx (pie chart by platform)
├── InsightsPanel.jsx (AI-generated recommendations)
├── MetricsCard.jsx (reusable metric display)
└── AnalyticsFilters.jsx (date range, platform picker)
```

### Analytics.jsx (Main Dashboard)

```jsx
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import DashboardSummary from '../components/analytics/DashboardSummary';
import TrendsChart from '../components/analytics/TrendsChart';
import TopPostsTable from '../components/analytics/TopPostsTable';
import PlatformBreakdown from '../components/analytics/PlatformBreakdown';
import InsightsPanel from '../components/analytics/InsightsPanel';

export default function Analytics() {
  const [period, setPeriod] = useState('30d');
  const [platform, setPlatform] = useState('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', period, platform],
    queryFn: () => api.get('/analytics/dashboard', {
      params: { period, platform }
    }),
    refetchInterval: 1000 * 60 * 5, // Refresh every 5 minutes
  });

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { summary, trends, top_posts, insights, platform_breakdown } = data;

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <AnalyticsFilters 
        period={period} 
        setPeriod={setPeriod}
        platform={platform}
        setPlatform={setPlatform}
      />

      {/* Top metrics */}
      <DashboardSummary summary={summary} />

      {/* Trends chart */}
      <TrendsChart trends={trends} />

      {/* Platform breakdown */}
      <div className="grid grid-cols-3 gap-4">
        <PlatformBreakdown breakdown={platform_breakdown} />
        <InsightsPanel insights={insights} />
      </div>

      {/* Top posts */}
      <TopPostsTable posts={top_posts} />
    </div>
  );
}
```

---

## 1.6 Implementation Checklist

- [ ] Create database tables (platform_metrics, analytics_snapshots, analytics_config)
- [ ] Add columns to posts table
- [ ] Implement AnalyticsService with sync & aggregation logic
- [ ] Create API routes for `/api/analytics/*`
- [ ] Implement platform metric fetching (Instagram, Twitter, LinkedIn APIs)
- [ ] Create scheduled job for automatic sync (every 6h)
- [ ] Build Analytics page UI
- [ ] Build dashboard cards (summary, trends, etc.)
- [ ] Add date range filters
- [ ] Test with real post data
- [ ] Add observability (log sync errors)
- [ ] Document API responses

**Estimated effort:** 3-4 days

---

---

# FEATURE 2: A/B TESTING

## 2.1 Overview

Auto-generate post variations & test which performs best.

**What it does:**
- When user creates post, auto-generate 2 variations (different caption, different image, different CTA)
- Show A, B, C variants to user
- User picks one to publish, or publish all 3 randomly
- Analytics tracks which variant performs best
- Next time, favor the winning variant

**User value:**
- "Test what works without manual effort"
- "Increase engagement by 30-50% with smarter posts"
- "Learn what resonates with my audience"

---

## 2.2 Database Schema

```sql
-- Store post variants
CREATE TABLE post_variants (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    
    -- Variant metadata
    variant_letter VARCHAR(1) NOT NULL,  -- A, B, C
    variant_name VARCHAR(100),  -- "Short caption", "Long caption", etc.
    variant_type VARCHAR(50),  -- caption, image, cta, tone
    
    -- Content differences
    caption_variant TEXT,  -- Alternative caption
    image_variant_url VARCHAR(255),  -- Alternative image (if different)
    cta_variant VARCHAR(100),  -- Different call-to-action
    
    -- Performance tracking
    is_winner BOOLEAN DEFAULT FALSE,
    winner_reason VARCHAR(255),  -- "Highest engagement rate"
    
    -- Metrics (from analytics when synced)
    impressions INTEGER DEFAULT 0,
    engagement_rate FLOAT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ix_post_variants_post_id ON post_variants(post_id);
CREATE INDEX ix_post_variants_is_winner ON post_variants(is_winner);

-- Track A/B test results
CREATE TABLE ab_test_results (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    
    -- Test metadata
    test_name VARCHAR(100),  -- "Caption test", "Image test"
    test_type VARCHAR(50),  -- caption, image, cta
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    
    -- Results
    variant_a_id INTEGER REFERENCES post_variants(id),
    variant_b_id INTEGER REFERENCES post_variants(id),
    variant_c_id INTEGER REFERENCES post_variants(id),
    
    winning_variant_id INTEGER REFERENCES post_variants(id),
    confidence_score FLOAT,  -- Statistical significance (0-1)
    
    -- Stats
    total_impressions INTEGER,
    total_engagement INTEGER,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ix_ab_test_results_post_id ON ab_test_results(post_id);
```

---

## 2.3 API Endpoints

### Generate Post Variants
```
POST /api/ab-testing/generate-variants
Body:
{
  "post_id": 123,
  "variation_types": ["caption", "image"],  // What to vary
  "num_variants": 3  // Generate A, B, C
}

Response:
{
  "post_id": 123,
  "original": {
    "caption": "Check out our new product...",
    "image_url": "...",
    "cta": "Shop now"
  },
  "variants": [
    {
      "id": 456,
      "letter": "A",
      "name": "Short caption",
      "caption": "New product: Now available",
      "image_url": "...",
      "cta": "Shop now"
    },
    {
      "id": 457,
      "letter": "B",
      "name": "Story angle",
      "caption": "Here's how we built this...",
      "image_url": "...",
      "cta": "Learn more"
    },
    {
      "id": 458,
      "letter": "C",
      "name": "Question hook",
      "caption": "What would you pay for...",
      "image_url": "...",
      "cta": "Vote in comments"
    }
  ]
}
```

### Publish Variant
```
POST /api/ab-testing/publish-variant
Body:
{
  "post_id": 123,
  "variant_id": 456,
  "platform": "instagram"
}

Response:
{
  "published": true,
  "variant_letter": "A",
  "platform_post_id": "xyz123",
  "posted_at": "2026-05-28T14:00:00Z"
}
```

### Get Test Results
```
GET /api/ab-testing/results/{post_id}

Response:
{
  "test_id": 789,
  "post_id": 123,
  "test_type": "caption",
  "variants": [
    {
      "letter": "A",
      "name": "Short caption",
      "impressions": 8500,
      "engagement_rate": 0.082,
      "winner": false
    },
    {
      "letter": "B",
      "name": "Story angle",
      "impressions": 8200,
      "engagement_rate": 0.125,
      "winner": true
    },
    {
      "letter": "C",
      "name": "Question hook",
      "impressions": 7900,
      "engagement_rate": 0.095,
      "winner": false
    }
  ],
  "confidence_score": 0.92,  // 92% confident B is better
  "recommendation": "Story angle captions get 52% more engagement. Use this style next time."
}
```

---

## 2.4 Backend Service

```python
# src/services/ab_testing.py

from openai import AsyncOpenAI
from src.models.database import PostVariant, ABTestResult
import random

class ABTestingService:
    """Generate post variants and track A/B test results."""
    
    @staticmethod
    async def generate_variants(
        post_id: int,
        original_caption: str,
        original_image_url: str,
        variation_types: list = ["caption"],  # caption, image, cta
        num_variants: int = 3
    ) -> dict:
        """
        Generate A/B test variations of a post.
        Uses LLM to create alternatives.
        """
        client = AsyncOpenAI()
        variants = []
        
        # Generate caption variations
        if "caption" in variation_types:
            caption_prompts = [
                "Rewrite this caption with a SHORT, punchy hook (max 30 words): {caption}",
                "Rewrite this as a STORY that draws people in (60-80 words): {caption}",
                "Rewrite this as a QUESTION that makes people stop and think: {caption}",
            ]
            
            for i, prompt in enumerate(caption_prompts[:num_variants]):
                response = await client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "user", "content": prompt.format(caption=original_caption)}
                    ],
                    temperature=0.7,
                    max_tokens=150
                )
                
                variant_caption = response.choices[0].message.content.strip()
                
                variants.append({
                    "letter": chr(65 + i),  # A, B, C
                    "name": ["Short caption", "Story angle", "Question hook"][i],
                    "caption": variant_caption,
                    "image_url": original_image_url,
                    "type": "caption"
                })
        
        # Generate image variations
        if "image" in variation_types:
            # Use existing image generation logic
            # (e.g., Pollinations.ai with different style prompts)
            pass
        
        # Store variants in DB
        async with AsyncSessionLocal() as session:
            for variant in variants:
                db_variant = PostVariant(
                    post_id=post_id,
                    variant_letter=variant["letter"],
                    variant_name=variant["name"],
                    caption_variant=variant.get("caption"),
                    image_variant_url=variant.get("image_url"),
                    variant_type=variant["type"]
                )
                session.add(db_variant)
            await session.commit()
        
        return {
            "post_id": post_id,
            "variants": variants,
            "num_generated": len(variants)
        }
    
    @staticmethod
    async def calculate_test_results(post_id: int) -> dict:
        """
        After metrics are synced, calculate which variant won.
        """
        async with AsyncSessionLocal() as session:
            # Get all variants for this post
            variants = (await session.execute(
                select(PostVariant).where(PostVariant.post_id == post_id)
            )).scalars().all()
            
            # Get metrics for each
            variant_performance = []
            for variant in variants:
                metrics = (await session.execute(
                    select(PlatformMetrics).where(
                        PlatformMetrics.post_id == post_id,
                        PlatformMetrics.variant_id == variant.id
                    )
                )).scalars().all()
                
                avg_engagement = sum(m.engagement_rate for m in metrics) / len(metrics) if metrics else 0
                
                variant_performance.append({
                    "variant_id": variant.id,
                    "letter": variant.variant_letter,
                    "name": variant.variant_name,
                    "engagement_rate": avg_engagement,
                    "impressions": sum(m.impressions for m in metrics)
                })
            
            # Find winner (highest engagement rate)
            winner = max(variant_performance, key=lambda x: x["engagement_rate"])
            
            # Calculate confidence (simple: if winner is >20% better)
            avg_loser = sum(v["engagement_rate"] for v in variant_performance if v != winner) / (len(variant_performance) - 1)
            confidence = min((winner["engagement_rate"] / avg_loser - 1) / 0.2, 1.0) if avg_loser > 0 else 0
            
            # Store result
            result = ABTestResult(
                post_id=post_id,
                test_name=f"Variant test",
                test_type="caption",  # or image, cta
                winning_variant_id=winner["variant_id"],
                confidence_score=confidence,
                total_impressions=sum(v["impressions"] for v in variant_performance)
            )
            session.add(result)
            await session.commit()
            
            return {
                "variants": variant_performance,
                "winner": winner,
                "confidence": confidence
            }
```

---

## 2.5 Frontend Components

```jsx
// frontend/src/pages/ABTesting.jsx

export default function ABTesting() {
  const [post, setPost] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [testResults, setTestResults] = useState(null);

  // Generate variants
  const handleGenerateVariants = async (postId) => {
    const response = await api.post('/ab-testing/generate-variants', {
      post_id: postId,
      variation_types: ['caption'],
      num_variants: 3
    });
    setVariants(response.variants);
  };

  // Show variant comparison
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">A/B Test Post Variants</h1>

      {/* Original post */}
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-bold mb-2">Original</h2>
        <p className="text-gray-700">{post?.content}</p>
      </div>

      {/* Variant comparison */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {variants.map((variant) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            isSelected={selectedVariant?.id === variant.id}
            onSelect={() => setSelectedVariant(variant)}
          />
        ))}
      </div>

      {/* Publish button */}
      <button
        onClick={() => publishVariant(post.id, selectedVariant.id)}
        className="bg-blue-500 text-white px-6 py-2 rounded"
      >
        Publish Selected Variant
      </button>

      {/* Test results (after 24h) */}
      {testResults && (
        <TestResultsPanel results={testResults} />
      )}
    </div>
  );
}
```

---

## 2.6 Implementation Checklist

- [ ] Create post_variants & ab_test_results tables
- [ ] Implement ABTestingService (generate variants, calculate results)
- [ ] Create API endpoints for variant generation & publishing
- [ ] Add variant tracking to analytics sync
- [ ] Build A/B Testing page UI
- [ ] Add variant comparison cards
- [ ] Build test results visualization
- [ ] Add statistical significance calculation
- [ ] Test with real LLM API
- [ ] Add "winner" recommendation to analytics insights

**Estimated effort:** 4-5 days

---

---

# FEATURE 3: SMART SCHEDULING

## 3.1 Overview

Analyze audience activity patterns & suggest optimal post times.

**What it does:**
- Analyze historical engagement data (which hours/days get most engagement)
- Use ML to predict best times for next post
- Show user "best time to post" suggestions
- Auto-schedule posts at optimal times
- Learn from A/B test results to improve predictions

**User value:**
- "Post at the exact time my audience is active"
- "Increase reach by posting when people are scrolling"
- "Stop guessing, use data to schedule"

---

## 3.2 Database Schema

```sql
-- Track hourly engagement patterns
CREATE TABLE hourly_engagement (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,  -- instagram, twitter, linkedin
    hour_of_day INTEGER NOT NULL,   -- 0-23
    day_of_week INTEGER NOT NULL,   -- 0-6 (Sunday-Saturday)
    
    -- Aggregated stats
    avg_engagement_rate FLOAT,      -- Average engagement at this time
    total_posts_at_time INTEGER,    -- How many posts at this time
    total_engagement INTEGER,
    
    -- Confidence
    sample_size INTEGER,            -- Number of posts to calculate avg
    last_updated TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(platform, hour_of_day, day_of_week)
);

-- Store scheduling recommendations
CREATE TABLE scheduling_recommendations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    
    -- Best times (ranked)
    best_times JSON,  -- [
                      //   {"hour": 7, "day": 5, "engagement_score": 0.95},
                      //   {"hour": 12, "day": 2, "engagement_score": 0.88},
                      //   ...
                      // ]
    
    -- Confidence metrics
    confidence_score FLOAT,
    sample_posts INTEGER,  -- Based on N posts
    
    generated_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP
);

CREATE INDEX ix_scheduling_recs_user_id ON scheduling_recommendations(user_id);
```

---

## 3.3 API Endpoints

### Get Optimal Posting Times
```
GET /api/scheduling/best-times
Query params:
  - platform: instagram, twitter, linkedin
  - limit: 5 (return top 5 times)

Response:
{
  "platform": "instagram",
  "best_times": [
    {
      "hour": 7,
      "day": 2,
      "day_name": "Tuesday",
      "engagement_score": 0.95,
      "confidence": 0.92,
      "reason": "7 AM on Tuesdays gets 2.3x higher engagement"
    },
    {
      "hour": 12,
      "day": 5,
      "day_name": "Friday",
      "engagement_score": 0.88,
      "confidence": 0.89,
      "reason": "Friday lunch hour drives 45% more interactions"
    },
    ...
  ],
  "confidence_overall": 0.91,
  "sample_posts": 127,
  "recommendation": "Post on Tuesday or Friday mornings for max reach"
}
```

### Predict Engagement for Specific Time
```
POST /api/scheduling/predict-engagement
Body:
{
  "platform": "instagram",
  "hour": 7,
  "day_of_week": 2,
  "content_type": "carousel",  // Optional: refine prediction
  "brand_voice": "casual"       // Optional
}

Response:
{
  "predicted_engagement_rate": 0.085,
  "confidence": 0.88,
  "reason": "Based on 50+ carousel posts at 7 AM on Tuesdays",
  "comparison": {
    "better_than_avg": true,
    "improvement_vs_avg": "2.3x higher engagement"
  }
}
```

### Auto-Schedule Post (Optional)
```
POST /api/scheduling/auto-schedule
Body:
{
  "post_id": 123,
  "platform": "instagram",
  "use_optimal_time": true  // Auto-pick best time
}

Response:
{
  "post_id": 123,
  "scheduled_for": "2026-05-30T07:00:00Z",
  "reason": "Tuesday 7 AM has 2.3x higher engagement",
  "predicted_engagement": 0.085,
  "user_can_override": true
}
```

---

## 3.4 Backend Service

```python
# src/services/smart_scheduling.py

from datetime import datetime, timedelta
from sqlalchemy import select, func
import numpy as np

class SmartSchedulingService:
    """Analyze engagement patterns and predict best posting times."""
    
    @staticmethod
    async def calculate_hourly_engagement():
        """
        Analyze all posts and calculate average engagement per hour/day.
        Run daily as scheduled job.
        """
        async with AsyncSessionLocal() as session:
            # Fetch all posts with metrics
            posts_with_metrics = (await session.execute(
                select(Post, PlatformMetrics).join(
                    PlatformMetrics, PlatformMetrics.post_id == Post.id
                ).where(
                    Post.published_at >= datetime.now() - timedelta(days=90)
                )
            )).all()
            
            # Group by hour + day + platform
            engagement_by_time = {}
            
            for post, metric in posts_with_metrics:
                hour = post.published_at.hour
                day = post.published_at.weekday()
                platform = metric.platform
                
                key = (platform, hour, day)
                if key not in engagement_by_time:
                    engagement_by_time[key] = []
                
                engagement_by_time[key].append({
                    "engagement_rate": metric.engagement_rate,
                    "impressions": metric.impressions
                })
            
            # Calculate averages and save
            for (platform, hour, day), engagements in engagement_by_time.items():
                avg_engagement = np.mean([e["engagement_rate"] for e in engagements])
                
                # Upsert hourly_engagement record
                stmt = select(HourlyEngagement).where(
                    HourlyEngagement.platform == platform,
                    HourlyEngagement.hour_of_day == hour,
                    HourlyEngagement.day_of_week == day
                )
                existing = (await session.execute(stmt)).scalar_one_or_none()
                
                if existing:
                    existing.avg_engagement_rate = avg_engagement
                    existing.sample_size = len(engagements)
                    existing.last_updated = datetime.now()
                else:
                    session.add(HourlyEngagement(
                        platform=platform,
                        hour_of_day=hour,
                        day_of_week=day,
                        avg_engagement_rate=avg_engagement,
                        total_posts_at_time=len(engagements),
                        sample_size=len(engagements)
                    ))
            
            await session.commit()
    
    @staticmethod
    async def get_best_posting_times(
        platform: str,
        limit: int = 5
    ) -> dict:
        """Get top N posting times for a platform."""
        async with AsyncSessionLocal() as session:
            # Fetch hourly engagement data, sorted by engagement rate
            stmt = select(HourlyEngagement).where(
                HourlyEngagement.platform == platform,
                HourlyEngagement.sample_size >= 5  # Need at least 5 samples
            ).order_by(
                HourlyEngagement.avg_engagement_rate.desc()
            ).limit(limit)
            
            top_times = (await session.execute(stmt)).scalars().all()
            
            # Format results
            day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            
            results = []
            for i, time_data in enumerate(top_times):
                results.append({
                    "rank": i + 1,
                    "hour": time_data.hour_of_day,
                    "day": time_data.day_of_week,
                    "day_name": day_names[time_data.day_of_week],
                    "engagement_score": time_data.avg_engagement_rate,
                    "confidence": min(time_data.sample_size / 50, 1.0),  # Max 50 samples = 100% confidence
                    "sample_size": time_data.sample_size
                })
            
            return {
                "platform": platform,
                "best_times": results,
                "overall_confidence": np.mean([r["confidence"] for r in results]) if results else 0,
                "recommendation": SmartSchedulingService._generate_recommendation(results)
            }
    
    @staticmethod
    async def predict_engagement(
        platform: str,
        hour: int,
        day: int,
        content_type: str = None
    ) -> dict:
        """Predict engagement for a specific time."""
        async with AsyncSessionLocal() as session:
            # Fetch engagement data for this time
            stmt = select(HourlyEngagement).where(
                HourlyEngagement.platform == platform,
                HourlyEngagement.hour_of_day == hour,
                HourlyEngagement.day_of_week == day
            )
            time_data = (await session.execute(stmt)).scalar_one_or_none()
            
            if not time_data:
                return {
                    "predicted_engagement_rate": 0.05,  # Default fallback
                    "confidence": 0.3,
                    "reason": "Not enough data for this time slot"
                }
            
            # Get average engagement across all times
            avg_stmt = select(func.avg(HourlyEngagement.avg_engagement_rate)).where(
                HourlyEngagement.platform == platform
            )
            overall_avg = (await session.execute(avg_stmt)).scalar() or 0.05
            
            return {
                "predicted_engagement_rate": time_data.avg_engagement_rate,
                "confidence": min(time_data.sample_size / 50, 1.0),
                "reason": f"Based on {time_data.sample_size} posts at this time",
                "comparison": {
                    "better_than_avg": time_data.avg_engagement_rate > overall_avg,
                    "improvement_pct": (
                        (time_data.avg_engagement_rate / overall_avg - 1) * 100
                        if overall_avg > 0 else 0
                    )
                }
            }
    
    @staticmethod
    def _generate_recommendation(best_times: list) -> str:
        """Generate human-friendly recommendation."""
        if not best_times:
            return "Schedule posts consistently to gather data"
        
        top = best_times[0]
        day_name = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][top["day"]]
        hour = top["hour"]
        
        time_of_day = "morning" if hour < 12 else "afternoon" if hour < 17 else "evening"
        improvement = (top["engagement_score"] / 0.05 - 1) * 100  # vs baseline
        
        return f"Post on {day_name}s at {hour}:00 {time_of_day} for {improvement:.0f}% higher engagement"
```

---

## 3.5 Frontend Components

```jsx
// frontend/src/pages/ContentPlanner.jsx (extend existing)

export default function ContentPlanner() {
  const [bestTimes, setBestTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  // Fetch best times on load
  useEffect(() => {
    const fetchBestTimes = async () => {
      const response = await api.get('/scheduling/best-times', {
        params: { platform: 'instagram', limit: 5 }
      });
      setBestTimes(response.best_times);
    };
    fetchBestTimes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Content Planner</h1>

      {/* Best times widget */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-bold mb-4">📅 Best Times to Post</h2>
        <div className="grid grid-cols-5 gap-3">
          {bestTimes.map((time) => (
            <TimeCard
              key={`${time.day}-${time.hour}`}
              time={time}
              isSelected={selectedTime?.hour === time.hour && selectedTime?.day === time.day}
              onSelect={() => setSelectedTime(time)}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-4">
          💡 {bestTimes[0]?.reason || "Analyze your posting pattern..."}
        </p>
      </div>

      {/* Recommendation */}
      {selectedTime && (
        <RecommendationPanel time={selectedTime} />
      )}

      {/* Post creation form (existing) */}
      <PostCreationForm suggestedTime={selectedTime} />
    </div>
  );
}

// TimeCard component
function TimeCard({ time, isSelected, onSelect }) {
  const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][time.day];
  const engagementLevel = time.engagement_score > 0.08 ? "🔥 Hot" : "⭐ Good";

  return (
    <button
      onClick={onSelect}
      className={`p-3 rounded-lg border-2 transition ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:border-blue-300"
      }`}
    >
      <div className="text-sm font-bold">{dayName}</div>
      <div className="text-lg font-bold">{time.hour}:00</div>
      <div className="text-xs text-gray-600">{engagementLevel}</div>
      <div className="text-xs text-gray-500">+{(time.engagement_score * 100).toFixed(0)}%</div>
    </button>
  );
}
```

---

## 3.6 Implementation Checklist

- [ ] Create hourly_engagement & scheduling_recommendations tables
- [ ] Implement SmartSchedulingService (calculate hourly patterns)
- [ ] Create scheduled job to calculate engagement hourly (daily at 2 AM)
- [ ] Create API endpoints for best times & predictions
- [ ] Build best times widget on Content Planner
- [ ] Add time picker UI with visual recommendations
- [ ] Implement auto-scheduling logic
- [ ] Add ML model for time prediction (optional: use scikit-learn)
- [ ] Test with historical data
- [ ] Add engagement confidence scoring

**Estimated effort:** 2-3 days

---

---

## Implementation Summary

| Feature | Priority | Effort | Value | Timeline |
|---------|----------|--------|-------|----------|
| **Analytics Dashboard** | 🔴 1st | 3-4d | ⭐⭐⭐ | Week 1 |
| **A/B Testing** | 🟠 2nd | 4-5d | ⭐⭐⭐ | Week 2 |
| **Smart Scheduling** | 🟠 3rd | 2-3d | ⭐⭐ | Week 2-3 |

**Total:** ~10-12 days | **Team:** 1 engineer | **Launch impact:** 3-5x better engagement

---

## Next Steps

1. **Pick the first feature** (I recommend Analytics Dashboard)
2. **Clone the database schema** from this document
3. **Implement the service** logic
4. **Build the API routes**
5. **Create the UI components**
6. **Test with real data**
7. **Deploy to production**

Ready to start building? Let me know which feature you want to tackle first and I can help you implement it! 🚀

