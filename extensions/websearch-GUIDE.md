# Web Search 配置指南

## 默认搜索引擎：SearXNG ✅

**开箱即用，无需任何配置！**

默认使用 SearXNG 搜索引擎（https://sousuo.emoe.top），这是一个开源的隐私尊重元搜索引擎，无需 API 密钥，直接可用。

### SearXNG 特性

- ✅ **无需配置**：即开即用
- ✅ **无限制**：没有查询配额限制
- ✅ **隐私保护**：不追踪用户搜索记录
- ✅ **聚合搜索**：整合多个搜索引擎结果
- ✅ **结果丰富**：包含标题、URL、摘要

## 使用方法

直接在 pi 中搜索即可：

```
搜索最新的 Node.js 版本
Search for "Samsung 2026 plans"
查找 Python 3.13 新特性
```

## 可选搜索引擎

如果你需要更好的搜索质量或 AI 增强功能，可以配置 Tavily：

### Tavily（AI 驱动搜索，1,000 次免费/月）

Tavily 提供 AI 增强的搜索功能，包括：
- ✅ 相关性评分
- ✅ 自然语言理解
- ✅ 更好的复杂查询处理
- ✅ 直接答案生成

#### 获取 API Key

1. 访问 https://tavily.com/
2. 注册免费账号
3. 在 Dashboard 获取 API Key
4. 免费额度：1,000 次搜索/月

#### 设置环境变量

添加到你的 shell 配置文件（`~/.zshrc` 或 `~/.bashrc`）：

```bash
# Tavily API（可选，推荐用于复杂查询）
export TAVILY_API_KEY=your_api_key_here
```

然后重新加载配置：

```bash
source ~/.zshrc
# 或
source ~/.bashrc
```

### 自定义 SearXNG 实例（可选）

如果你想使用自己的 SearXNG 实例：

```bash
export SEARXNG_URL=https://your-custom-searxng-instance.com/search
```

部署 SearXNG：https://searxng.org/

## 搜索引擎选择

### 自动模式（默认）

当 `SEARCH_ENGINE=auto` 或未设置时，pi 会按以下顺序尝试：

1. **SearXNG**（默认，无需配置）
2. **Tavily**（如果配置了 API Key）

### 指定搜索引擎

可以在搜索时指定搜索引擎：

```
使用 SearXNG 搜索 "Python"
使用 Tavily 搜索 "How to implement microservices"
```

或在代码中设置环境变量：

```bash
export SEARCH_ENGINE=searxng    # 仅使用 SearXNG
export SEARCH_ENGINE=tavily     # 仅使用 Tavily
```

## Tavily 使用场景

Tavily 在以下场景下表现更好：

- **复杂的多部分查询**："比较 React Vue Angular 的性能差异"
- **自然语言问题**："如何在生产环境中部署 Kubernetes"
- **需要直接答案**："What is the current version of Node.js?"
- **复杂的技术问题**："如何实现事件溯源模式"

## 配额说明

### SearXNG
- **免费配额**: 无限制
- **说明**: 由实例提供者维护

### Tavily
- **免费配额**: 1,000 次搜索/月
- **查看使用量**: https://tavily.com/dashboard
- **超额付费**: 参见定价页面

## 搜索引擎对比

| 特性 | SearXNG | Tavily |
|------|---------|---------|
| 免费配额 | 无限制 | 1,000次/月 |
| 需要配置 | 否 | 是（API Key） |
| AI 增强 | 否 | 是 |
| 相关性评分 | 无 | 有 |
| 自然语言理解 | 基础 | 强 |
| 搜索质量 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 隐私保护 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 推荐度 | ⭐⭐⭐⭐⭐（默认） | ⭐⭐⭐⭐（可选） |

## 故障排除

### SearXNG 无法连接

- 检查网络连接
- 尝试使用自定义 SearXNG 实例
- 切换到 Tavily

### Tavily 搜索失败

- 检查 `TAVILY_API_KEY` 是否正确设置
- 确认 API Key 有效
- 检查配额是否用完（https://tavily.com/dashboard）

### 无搜索结果

- 尝试不同的搜索引擎
- 检查搜索查询是否正确
- 使用更简单的查询词

## 代理配置

如果需要通过代理访问：

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
```

## 环境变量速查

| 变量 | 描述 | 必需 |
|------|------|------|
| `SEARXNG_URL` | 自定义 SearXNG 实例 URL | 可选 |
| `TAVILY_API_KEY` | Tavily API Key | Tavily 必需 |
| `HTTP_PROXY` | HTTP 代理地址 | 可选 |
| `HTTPS_PROXY` | HTTPS 代理地址 | 可选 |
| `SEARCH_ENGINE` | 搜索引擎 (auto/searxng/tavily) | 可选，默认 auto |

## 快速开始

```bash
# 安装扩展（已完成）
cp /opt/homebrew/lib/node_modules/@mariozechner/pi-coding-agent/examples/extensions/websearch.ts ~/.pi/agent/extensions/

# 在 pi 中重新加载
/reload

# 开始搜索！
搜索最新的 Node.js 版本
```

不需要任何配置，直接使用即可！

如果需要更好的搜索质量，配置 Tavily：

```bash
export TAVILY_API_KEY=your_api_key_here
```
