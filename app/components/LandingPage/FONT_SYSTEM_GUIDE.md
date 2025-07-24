# LandingPage 统一字体管理系统

## 字体等级系统（6种组合）- 基于现代设计规范

参考 Apple.com 等业界领先网站的设计规范，我们重新设计了6个统一的字体等级：

### Level 1: Hero和大型数字 - 最大最粗
- **字号**: clamp(2.5rem, 5vw, 4rem) → 最大64px（原72px）
- **字重**: 800（原900）
- **行高**: 1.05（更紧凑）
- **字间距**: -0.02em（负间距，更现代）
- **用途**: Hero标题、结束字块（CTA标题）、大型数字展示

### Level 2: Section主标题 - 第二大第二粗
- **字号**: clamp(1.5rem, 2.5vw, 2rem) → 最大32px（原40px）
- **字重**: 700
- **行高**: 1.2
- **字间距**: -0.01em
- **用途**: 各Section的主标题

### Level 3: Section副标题和卡片标题 - 第三大
- **字号**: clamp(1.125rem, 1.75vw, 1.5rem) → 最大24px（原28px）
- **字重**: 600
- **行高**: 1.3
- **字间距**: -0.005em
- **用途**: Section副标题、卡片标题、图表标题

### Level 4: Section正文 - 中等
- **字号**: clamp(0.9375rem, 1.25vw, 1.125rem) → 最大18px（原20px）
- **字重**: 400
- **行高**: 1.65（提高可读性）
- **字间距**: 0
- **用途**: 正文内容、段落文字

### Level 5: 表格正文、导航菜单 - 较小
- **字号**: clamp(0.875rem, 1vw, 1rem) → 最大16px（原17.6px）
- **字重**: 400
- **行高**: 1.5
- **字间距**: 0
- **用途**: 表格内容、导航菜单、按钮文字

### Level 6: 解释类文档、备注 - 最细最小
- **字号**: clamp(0.8125rem, 0.9vw, 0.875rem) → 最大14px（原15.2px）
- **字重**: 400（提高到400保证可读性）
- **行高**: 1.5
- **字间距**: 0.01em（轻微增加）
- **用途**: 注释、备注、辅助说明文字

## 使用示例

```tsx
// Hero标题 - Level 1
<h1 style={{
  fontSize: DESIGN_TOKENS.typography.level1.fontSize,
  fontWeight: DESIGN_TOKENS.typography.level1.fontWeight,
  lineHeight: DESIGN_TOKENS.typography.level1.lineHeight,
}}>
  十方众声
</h1>

// Section标题 - Level 2
<h2 style={{
  fontSize: DESIGN_TOKENS.typography.level2.fontSize,
  fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
  lineHeight: DESIGN_TOKENS.typography.level2.lineHeight,
}}>
  关于我们
</h2>

// 正文段落 - Level 4
<p style={{
  fontSize: DESIGN_TOKENS.typography.level4.fontSize,
  fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
  lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
}}>
  我们是新一代内容营销生态构建者...
</p>
```

## 响应式设计

所有字体大小都使用了 `clamp()` 函数，确保在不同屏幕尺寸下都有良好的显示效果：
- 最小值：适用于移动设备
- 理想值：基于视口宽度的动态计算
- 最大值：适用于大屏幕设备

## 注意事项

1. **不要混用旧的字体系统**：已经移除了 `componentFonts` 和旧的 `fontSize` 定义
2. **保持一致性**：相同类型的内容应该使用相同的字体等级
3. **层次分明**：通过不同的字体等级创建清晰的视觉层次
4. **可访问性**：最小字号不低于 0.75rem，确保可读性

## 已更新的组件

- ✅ 主组件 index.tsx - 所有Section的标题和内容
- ✅ 导航栏 - Level 5
- ✅ 按钮文字 - Level 5
- ✅ ScrollingTags - Level 5
- ✅ GrowthMetrics - Level 3 (标题) / Level 6 (副标题)
- ✅ ModernChart - Level 3 (标题) / Level 5 (数据) / Level 6 (标签)
- ✅ ClientSatisfactionMetrics - Level 1 (数字) / Level 3 (标题) / Level 6 (描述)
- ✅ MarketingEffectivenessMetrics - Level 1 (数字) / Level 3 (标题) / Level 6 (描述)
- ✅ Footer - Level 6
- ✅ 语言切换 - Level 6