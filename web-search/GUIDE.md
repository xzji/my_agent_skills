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

如果你需要其他搜索引擎，可以配置以下选项：

### Google Custom Search（100 次免费/天）

1. 访问 Google Cloud Console: https://console.cloud.google.com/
2. 创建新项目或选择现有项目
3. 进入 **APIs & Services** → **Library**
4. 搜索 "Custom Search API" 并启用
5. 进入 **APIs & Services** → **Credentials**
6. 点击 **Create credentials** → **API key**
7. 复制生成的 API Key

### 创建 Google 自定义搜索引擎

1. 访问 Programmable Search Engine: https://programmablesearchengine.google.com/
2. 点击 **Add**
3. 配置搜索引擎：
   - **名称**: 输入名称（如 "My Search Engine"）
   - **要搜索的站点**: 输入 `*` 或留空以搜索整个网络
   - 点击 **创建**
4. 在设置页面：
   - 进入 **Setup** → **Basics**
   - 找到 **Search engine ID (cx)**，复制这个值

### 设置环境变量

添加到你的 shell 配置文件（`~/.zshrc` 或 `~/.bashrc`）：

```bash
# Google Custom Search（可选）
export GOOGLE_API_KEY=your_api_key_here
export GOOGLE_CX_ID=your_cx_id_here

# 自定义 SearXNG 实例（可选）
export SEARXNG_URL=https://your-custom-searxng-instance.com/search
```

然后重新加载配置：

```bash
source ~/.zshrc
# 或
source ~/.bashrc
```

## 搜索引擎选择

### 自动模式（默认）

当 `SEARCH_ENGINE=auto` 或未设置时，pi 会按以下顺序尝试：

1. **SearXNG**（默认，无需配置）
2. **Google Custom Search**（如果配置了 API Key 和 CX ID）
3. **DuckDuckGo**（备选）

### 指定搜索引擎

可以在搜索时指定搜索引擎：

```
使用 SearXNG 搜索 "Python"
使用 Google 搜索 "Node.js"
```

或在代码中设置环境变量：

```bash
export SEARCH_ENGINE=searxng    # 仅使用 SearXNG
export SEARCH_ENGINE=google     # 仅使用 Google
export SEARCH_ENGINE=duckduckgo # 仅使用 DuckDuckGo
```

## DuckDuckGo 配置（备选）

如果需要使用 DuckDuckGo：

### 使用 WebShare 代理（推荐）

```bash
export WEBSHARE_API_KEY=your_webshare_key
```

### 使用 HTTP 代理

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
```

## 自定义 SearXNG 实例

如果你想使用自己的 SearXNG 实例：

```bash
export SEARXNG_URL=https://your-searxng-instance.com/search
```

部署 SearXNG：https://searxng.org/

## 配额说明

### SearXNG
- **免费配额**: 无限制
- **说明**: 由实例提供者维护

### Google Custom Search
- **免费配额**: 每天 100 次查询
- **查看使用量**: https://console.cloud.google.com/apis/api/customsearch.googleapis.com/quotas
- **超额费用**: 每千次查询 $5 USD

### DuckDuckGo
- **免费配额**: 无限制
- **说明**: 公共 API，可能需要代理

## 搜索引擎对比

| 特性 | SearXNG | Google Custom Search | DuckDuckGo |
|------|---------|-------------------|-----------|
| 免费配额 | 无限制 | 100次/天 | 无限制 |
| 需要配置 | 否 | 是 | 否 |
| 搜索质量 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 隐私保护 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 推荐度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

## 故障排除

### SearXNG 无法连接

- 检查网络连接
- 尝试使用自定义 SearXNG 实例
- 切换到 Google 或 DuckDuckGo

### Google 搜索失败

- 检查 `GOOGLE_API_KEY` 和 `GOOGLE_CX_ID` 是否正确
- 确认 Custom Search API 已启用
- 检查配额是否用完

### DuckDuckGo 无法连接

- 尝试设置 `HTTP_PROXY` 环境变量
- 使用 WebShare 代理服务
- 切换到 SearXNG

### 无搜索结果

- 尝试不同的搜索引擎
- 检查搜索查询是否正确
- SearXNG 可能被某些网站屏蔽

## 环境变量速查

| 变量 | 描述 | 必需 |
|------|------|------|
| `SEARXNG_URL` | 自定义 SearXNG 实例 URL | 可选 |
| `GOOGLE_API_KEY` | Google Cloud API Key | Google 搜索必需 |
| `GOOGLE_CX_ID` | Custom Search Engine ID | Google 搜索必需 |
| `WEBSHARE_API_KEY` | WebShare API Key | DuckDuckGo 可选 |
| `HTTP_PROXY` | HTTP 代理地址 | 可选 |
| `HTTPS_PROXY` | HTTPS 代理地址 | 可选 |
| `SEARCH_ENGINE` | 搜索引擎 (auto/searxng/google/duckduckgo) | 可选，默认 auto |

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
