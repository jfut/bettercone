# Changelog

All notable changes to @bettercone/better-auth-plugin-usage-tracking will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-11-08

### Added

#### Initial Release

**Core Features**:
- Organization-level API usage tracking
- Automatic tracking of all Better Auth API calls
- Three reset modes: Lazy, Scheduled, Manual
- Configurable reset periods: Daily, Weekly, Monthly, Yearly
- Usage history table for analytics and time-series data
- Plan and features tracking per organization

**Server Plugin**:
- Schema extensions for organization table
- Usage history table with cascade deletion
- Hooks for automatic tracking (before/after)
- Lazy reset mode with automatic date checking
- API tracking with increment on every call
- 80% usage warning threshold

**Endpoints**:
- `getUsage` - Get current usage for organization
- `getUsageHistory` - Fetch historical usage data (limit parameter)
- `resetUsage` - Manual reset by admin
- `updateLimits` - Update limits and settings
- `resetExpired` - Scheduled reset for cron jobs (API key protected)

**Client Plugin**:
- Type-safe actions: getUsage, getUsageHistory, resetUsage, updateLimits
- Nanostores atoms for reactive state
- Helper functions: fetchUsage, fetchUsageHistory
- Full TypeScript support with declarations

**Callbacks**:
- `onLimitExceeded` - Triggered when limit is reached
- `onUsageWarning` - Triggered at 80% usage
- `onUsageReset` - Triggered on any reset (lazy, scheduled, manual)

**Configuration Options**:
- `resetMode` - "lazy" | "scheduled" | "manual" (default: "lazy")
- `resetPeriod` - "daily" | "weekly" | "monthly" | "yearly" (default: "monthly")
- `resetDay` - Day of month/week for reset (default: 1)
- `defaultApiLimit` - Default API limit for new orgs (default: 1000)
- `defaultPlanId` - Default plan for new orgs (default: "free")

**Documentation**:
- Comprehensive README with installation, setup, API reference
- Configuration examples for all reset modes
- Usage patterns with nanostores integration
- Troubleshooting guide
- Contributing guidelines

**Package**:
- ESM and CJS builds
- TypeScript declarations (.d.ts and .d.mts)
- Zero dependencies (nanostores peer dependency)
- ~25 KB total bundle size
