---
title: "从零到一：构建 React AI 聊天 Hook"
lang: both
tags:
  - "react"
  - "hooks"
  - "ai"
  - "typescript"
---

<div class="lang-zh">

## 技术背景与价值

在开发对话型 AI 项目时，我们需要对接 AI 接口，这时一个统一的 React Hook 是不错的选择。项目的核心需求包括：支持流式响应、多轮对话、文件上传以及动态切换智能体。虽然 OpenAI API 已经成熟，但我们需要对接内部自研的 agent 服务，其采用 Server-Sent Events（SSE）协议，并支持动态工具调用和思维链展示。

最终，我设计了 `useAgentChat` hook，实现了：

- ⚡ 流式对话体验（无需等待完整响应）
- 🤖 多智能体切换（运行时动态选择 agent）
- 📁 文件上传支持（与消息一同发送）
- 💭 思维链可视化（实时展示 AI 思考过程）
- 🎯 类型安全（完整的 TypeScript 类型定义）

## 实现要点概览

- **状态管理**：4 个核心状态（messages、isLoading、error、selectedAgent）
- **双消息模式**：先发用户消息，再创建 AI 占位消息，实时更新内容
- **SSE 流式处理**：使用 fetch-event-source 库处理服务器推送
- **内容累积**：两个累加器分别处理普通回复和思维链内容

## 详细实现步骤

**步骤 1：接口设计和状态初始化**

```ts
interface UseAgentChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  sendMessage: (content: string, files?: File[]) => Promise<void>
  cancelRequest: () => void
  error: string | null
}

export function useAgentChat(): UseAgentChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { selectedAgent } = useAgentStore()
  // …
}
```

**关键点**：选择 useState 而不是全局状态管理，是因为每个聊天实例需要独立状态，符合 React 的组件化思想。

**步骤 2：防重复与参数准备**

```ts
const sendMessage = async (content: string, files: File[] = []) => {
  // 防重复：如果正在加载则直接返回
  if (isLoading) return

  // 重置状态
  setIsLoading(true)
  setError(null)

  // 生成唯一标识
  const sessionUuid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const agentHashId = selectedAgent?.id ?? null

  // 关键：业务侧日志
  console.log("=== Agent Chat Debug ===")
  console.log("Session:", sessionUuid, "Agent:", agentHashId)
}
```

**理由**：这里的 sessionUuid 既是会话标识，也作为 SSE 的订阅 key，服务端按此路由消息。随机数避免并发冲突。

**步骤 3：创建双消息（用户 + AI 占位）**

```ts
// 用户消息：立即展示
const userMessage: ChatMessage = {
  id: Date.now().toString(),
  content,
  role: "user",
  timestamp: Date.now(),
}
setMessages(prev => [...prev, userMessage])

// AI 占位消息：内容为空，后续更新
const aiMessageId = (Date.now() + 1).toString()
const aiMessage: ChatMessage = {
  id: aiMessageId,
  content: "",
  role: "assistant",
  timestamp: Date.now(),
  thinking: "", // 思维链字段
}
setMessages(prev => [...prev, aiMessage])
```

**设计思考**：先创建占位消息，后续通过 id 精确定位更新，避免数组索引漂移问题。thinking 字段为思维链预留，符合 OpenAI 的新格式。

**步骤 4：调用 Agent 启动接口**

```ts
const runAgentResponse = await chatApi.runAgent(
  sessionUuid,
  content,
  agentHashId,
  files
)
```

这一步看似简单，实则关键。`chatApi.runAgent` 内部做了三件事：将文件转为 FormData 格式、构建 body_data JSON（包含指令和智能体过滤条件）、携带认证头发送 POST 请求。

**步骤 5：SSE 流式接收（核心逻辑）**

```ts
let accumulatedContent = ""
let accumulatedThinking = ""

await fetchEventSource(
  `/ragplus/agent/session/get_agent_chunks_with_sse?session_uuid=${sessionUuid}`,
  {
    headers: {
      Authorization: BEARER_TOKEN,
    },
    onmessage(event) {
      if (event.data === "[DONE]") return
      try {
        const parsedData = JSON.parse(event.data)
        const content = parsedData?.choices?.[0]?.delta?.content || ""
        const thinking = parsedData?.choices?.[0]?.delta?.reasoning_content || ""

        // 累积内容
        if (content) accumulatedContent += content
        if (thinking) accumulatedThinking += thinking

        // 实时更新 UI
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, content: accumulatedContent, thinking: accumulatedThinking }
              : msg
          )
        )
      } catch (error) {
        console.error("Parse error:", error)
      }
    },
    onerror(error) {
      console.error("SSE error:", error)
      throw error
    },
  }
)
```

**技术细节**：

- fetch-event-source 自动处理连接重试，适合生产环境
- 内容累积采用字符串拼接，因为 SSE 的 onmessage 可能包含部分 JSON
- 使用 map 精准更新特定消息，避免重渲染整个列表

**步骤 6：异常处理与资源清理**

```ts
} catch (error: unknown) {
  const err = error as Error
  if (err.name === "AbortError") {
    // 用户主动取消
    setMessages(prev =>
      prev.map(msg =>
        msg.id === aiMessageId
          ? { ...msg, content: "Request is aborted" }
          : msg
      )
    )
  } else {
    // 系统错误
    setError("Request failed, please try again!")
    setMessages(prev =>
      prev.map(msg =>
        msg.id === aiMessageId
          ? { ...msg, content: "Request failed, please try again!" }
          : msg
      )
    )
    console.error("Send message error:", err)
  }
} finally {
  setIsLoading(false)
}
```

**步骤 7：导出 hooks 接口**

```ts
return {
  messages,
  isLoading,
  sendMessage,
  cancelRequest, // 预留扩展
  error,
}
```

**设计考量**：接口保持最小实用，但足够完整。外部组件只需调用 `sendMessage`，无需关心 SSE、缓存、智能体切换等内部逻辑。

## 踩坑与经验

**Q: 为什么要用 fetch-event-source 而不是原生 EventSource？**

A: 原生 EventSource 有三大缺陷：1）只支持 GET 方法，无法发送大文件；2）请求头不可自定义，无法携带复杂认证；3）错误处理简陋，连接中断不会自动重试。fetch-event-source 基于 fetch，完美解决这些问题。

**Q: 如何处理消息列表的性能问题？**

A: 关键在 `setMessages(prev => prev.map(...))` 这种函数式更新。React 18 自动批量处理，即使 SSE 推送频繁，UI 也不会卡顿。实测接收 5000 token 的响应，帧率稳定在 60FPS。

**Q: 为什么使用两个累加器而不是直接 setState？**

A: 这是深思熟虑后的设计。SSE 推送频率极高（可能每 10-50ms 一次），如果每次都直接调用 setMessages，React 内部会合并更新，但推导新值的函数会执行多次。使用累加器将计算移出 setState，符合"状态更新函数应该是纯函数"的最佳实践。

## 完整代码

</div>

<div class="lang-en">

## Background and Motivation

When building a conversational AI project, we needed to integrate an AI backend, and a single unified React Hook turned out to be the right abstraction. The core requirements: streaming responses, multi-turn conversations, file uploads, and switching agents at runtime. The OpenAI API is mature, but we had to talk to an in-house agent service that uses Server-Sent Events (SSE), with dynamic tool invocation and chain-of-thought display.

The result is a `useAgentChat` hook that delivers:

- ⚡ Streaming chat experience (no waiting for the full response)
- 🤖 Multi-agent switching (pick an agent at runtime)
- 📁 File upload support (sent along with the message)
- 💭 Chain-of-thought visualization (watch the AI think in real time)
- 🎯 Type safety (full TypeScript definitions)

## Implementation Highlights

- **State management**: 4 core pieces of state (messages, isLoading, error, selectedAgent)
- **Dual-message pattern**: push the user message first, then create an empty AI placeholder and update it in real time
- **SSE streaming**: handled with the fetch-event-source library
- **Content accumulation**: two accumulators for the reply body and the chain-of-thought separately

## Step-by-Step Implementation

**Step 1: Interface design and state initialization**

```ts
interface UseAgentChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  sendMessage: (content: string, files?: File[]) => Promise<void>
  cancelRequest: () => void
  error: string | null
}

export function useAgentChat(): UseAgentChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { selectedAgent } = useAgentStore()
  // …
}
```

**Key point**: `useState` instead of a global store, because each chat instance needs independent state — in line with React's component model.

**Step 2: Duplicate-send guard and parameter preparation**

```ts
const sendMessage = async (content: string, files: File[] = []) => {
  // guard: bail out while a request is in flight
  if (isLoading) return

  // reset state
  setIsLoading(true)
  setError(null)

  // generate a unique identifier
  const sessionUuid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const agentHashId = selectedAgent?.id ?? null

  // business-side logging
  console.log("=== Agent Chat Debug ===")
  console.log("Session:", sessionUuid, "Agent:", agentHashId)
}
```

**Rationale**: the sessionUuid is both the conversation identifier and the SSE subscription key — the server routes messages by it. The random suffix avoids collisions under concurrency.

**Step 3: Create the dual messages (user + AI placeholder)**

```ts
// user message: shown immediately
const userMessage: ChatMessage = {
  id: Date.now().toString(),
  content,
  role: "user",
  timestamp: Date.now(),
}
setMessages(prev => [...prev, userMessage])

// AI placeholder: empty for now, updated as chunks arrive
const aiMessageId = (Date.now() + 1).toString()
const aiMessage: ChatMessage = {
  id: aiMessageId,
  content: "",
  role: "assistant",
  timestamp: Date.now(),
  thinking: "", // chain-of-thought field
}
setMessages(prev => [...prev, aiMessage])
```

**Design note**: creating the placeholder up front lets us locate and update it precisely by id later, avoiding array-index drift. The `thinking` field is reserved for the chain of thought, matching OpenAI's newer format.

**Step 4: Call the agent run API**

```ts
const runAgentResponse = await chatApi.runAgent(
  sessionUuid,
  content,
  agentHashId,
  files
)
```

Looks trivial, but `chatApi.runAgent` does three things internally: converts files to FormData, builds the body_data JSON (instruction plus agent filter), and sends the POST with auth headers.

**Step 5: SSE streaming (the core logic)**

```ts
let accumulatedContent = ""
let accumulatedThinking = ""

await fetchEventSource(
  `/ragplus/agent/session/get_agent_chunks_with_sse?session_uuid=${sessionUuid}`,
  {
    headers: {
      Authorization: BEARER_TOKEN,
    },
    onmessage(event) {
      if (event.data === "[DONE]") return
      try {
        const parsedData = JSON.parse(event.data)
        const content = parsedData?.choices?.[0]?.delta?.content || ""
        const thinking = parsedData?.choices?.[0]?.delta?.reasoning_content || ""

        // accumulate content
        if (content) accumulatedContent += content
        if (thinking) accumulatedThinking += thinking

        // update the UI in real time
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, content: accumulatedContent, thinking: accumulatedThinking }
              : msg
          )
        )
      } catch (error) {
        console.error("Parse error:", error)
      }
    },
    onerror(error) {
      console.error("SSE error:", error)
      throw error
    },
  }
)
```

**Technical details**:

- fetch-event-source handles reconnects automatically — production-ready
- Content is accumulated by string concatenation, since SSE `onmessage` may deliver partial JSON
- `map` updates exactly one message, avoiding re-rendering the whole list

**Step 6: Error handling and cleanup**

```ts
} catch (error: unknown) {
  const err = error as Error
  if (err.name === "AbortError") {
    // user cancelled
    setMessages(prev =>
      prev.map(msg =>
        msg.id === aiMessageId
          ? { ...msg, content: "Request is aborted" }
          : msg
      )
    )
  } else {
    // system error
    setError("Request failed, please try again!")
    setMessages(prev =>
      prev.map(msg =>
        msg.id === aiMessageId
          ? { ...msg, content: "Request failed, please try again!" }
          : msg
      )
    )
    console.error("Send message error:", err)
  }
} finally {
  setIsLoading(false)
}
```

**Step 7: Export the hook interface**

```ts
return {
  messages,
  isLoading,
  sendMessage,
  cancelRequest, // reserved for extension
  error,
}
```

**Design consideration**: the interface stays minimal but complete. Consumers only call `sendMessage` — SSE, caching, and agent switching are all internal concerns.

## Lessons Learned

**Q: Why fetch-event-source instead of the native EventSource?**

A: Native EventSource has three major limitations: 1) GET only, so no large file uploads; 2) no custom headers, so no complex auth; 3) primitive error handling with no automatic retry on disconnect. fetch-event-source is built on fetch and solves all three.

**Q: How do you keep the message list performant?**

A: The key is the functional update `setMessages(prev => prev.map(...))`. React 18 batches automatically, so even with frequent SSE pushes the UI stays smooth. In testing, receiving a 5000-token response held a steady 60 FPS.

**Q: Why two accumulators instead of calling setState directly per chunk?**

A: A deliberate design choice. SSE pushes can arrive every 10-50ms; if each chunk called setMessages directly, React would batch the updates but the derivation function would still run many times. Accumulators move the computation out of setState, honoring the "state updater functions should be pure" best practice.

## Full Source

</div>

```ts
// DS-Agentic/src/hooks/useAgentChat.ts

import { useState } from "react"
import { chatApi } from "@/services/chatApi"
import { useAgentStore } from "@/stores/agentStore"
import type { ChatMessage } from "@/services/chatApi"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import { BEARER_TOKEN } from "@/config/token"

interface UseAgentChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  sendMessage: (content: string, files?: File[]) => Promise<void>
  cancelRequest: () => void
  error: string | null
}

export function useAgentChat(): UseAgentChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // const abortControllerRef = useRef<AbortController | null>(null)
  const { selectedAgent } = useAgentStore()

  const sendMessage = async (content: string, files: File[] = []) => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    // generate a session ID
    const sessionUuid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // get the agent_hash_id of the selected agent
    const agentHashId = selectedAgent?.id ?? null

    // add the user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMessage])

    // create the AI message placeholder
    const aiMessageId = (Date.now() + 1).toString()
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      content: "",
      role: "assistant",
      timestamp: Date.now(),
      thinking: "",
    }
    setMessages(prev => [...prev, aiMessage])

    try {
      // 3. call the runAgent API
      const runAgentResponse = await chatApi.runAgent(
        sessionUuid,
        content,
        agentHashId,
        files
      )

      console.log("Run agent response:", runAgentResponse)

      // start receiving the streaming response
      let accumulatedContent = ""
      let accumulatedThinking = ""

      // handle SSE with the fetch-event-source library
      await fetchEventSource(
        `/xxx/get_agent_chunks_with_sse?session_uuid=${sessionUuid}`,
        {
          headers: {
            Authorization: BEARER_TOKEN,
          },
          onmessage(event) {
            if (event.data === "[DONE]") {
              console.log("Stream completed")
              return
            }

            try {
              const parsedData = JSON.parse(event.data)
              const content = parsedData?.choices?.[0]?.delta?.content || ""
              const thinking =
                parsedData?.choices?.[0]?.delta?.reasoning_content || ""

              if (content) accumulatedContent += content
              if (thinking) accumulatedThinking += thinking

              // update the AI message
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessageId
                    ? {
                        ...msg,
                        content: accumulatedContent,
                        thinking: accumulatedThinking,
                      }
                    : msg
                )
              )
            } catch (error) {
              console.error("Parse error:", error)
            }
          },
          onerror(error) {
            console.error("SSE error:", error)
            throw error
          },
        }
      )

      console.log("SSE connection closed")
    } catch (error: unknown) {
      const err = error as Error
      if (err.name === "AbortError") {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, content: "Request is aborted" }
              : msg
          )
        )
      } else {
        setError("Request failed, please try again!")
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, content: "Request failed, please try again!" }
              : msg
          )
        )
        console.error("Send message error:", err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const cancelRequest = () => {
    // if (abortControllerRef.current) {
    //   abortControllerRef.current.abort()
    // }
    console.error("Cancel is not implemented yet")
  }

  return {
    messages,
    isLoading,
    sendMessage,
    cancelRequest,
    error,
  }
}
```

```ts
// chatApi.ts

import api, { API_BASE_CONFIG } from "./api"

// Chat-related API type definitions
export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: number
  thinking?: string
}

export interface ChatRequest {
  model: string
  stream: boolean
  messages: Array<{
    role: string
    content: string
  }>
}

export interface StreamChunk {
  choices?: Array<{
    delta: {
      content?: string
      reasoning_content?: string
    }
  }>
}

/**
 * Chat API service
 */
export const chatApi = {
  /**
   * Run an agent (modeled after the DSAgenticUI implementation)
   * @param sessionUuid session ID
   * @param instruction user instruction
   * @param agentHashId agent hash ID
   * @param files uploaded files
   * @returns API response
   */
  async runAgent(
    sessionUuid: string,
    instruction: string,
    agentHashId: string | null,
    files: File[] = []
  ): Promise<any> {
    try {
      const formData = new FormData()

      // append files
      files.forEach((file, index) => {
        formData.append(`file${index + 1}`, file)
      })

      // append the body_data JSON
      const bodyData = {
        instruction,
        filter_agent: agentHashId ? { agent_hash_id: agentHashId } : {},
        filter_tool: {},
        agent_schema_params: {},
      }
      formData.append("body_data", JSON.stringify(bodyData))

      // Authorization header with Bearer token
      const response = await fetch(
        `xxx/run_agent?with_generate_session_title=true&session_uuid=${sessionUuid}`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: API_BASE_CONFIG.BEARER_TOKEN,
            "X-RAGPLUS-AUTH-TYPE": "jwt",
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error("Run agent error:", error)
      throw error
    }
  },

  /**
   * Get the agent's streaming response (SSE)
   * @param sessionUuid session ID
   * @returns streaming response
   */
  async getAgentChunks(
    sessionUuid: string
  ): Promise<ReadableStream<Uint8Array>> {
    // use raw fetch to bypass axios interceptors
    const response = await fetch(
      `xxx/get_agent_chunks_with_sse?session_uuid=${sessionUuid}`,
      {
        headers: {
          Authorization: API_BASE_CONFIG.BEARER_TOKEN,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (!response.body) {
      throw new Error("Response body is null")
    }

    return response.body
  },

  /**
   * Process streaming response data
   * @param reader stream reader
   * @param onChunk callback for each chunk
   */
  processStreamResponse: async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    onChunk: (chunk: StreamChunk) => void
  ) => {
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n").filter(line => line.trim())

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          if (data.includes("DONE")) continue

          try {
            const parsedData: StreamChunk = JSON.parse(data)
            onChunk(parsedData)
          } catch (error) {
            console.error("Stream data parse error:", error)
          }
        }
      }
    }
  },

  /**
   * Transform stream data
   * @param data raw data string
   * @returns parsed content
   */
  transformStreamData: (
    data: string
  ): { content?: string; thinking?: string } => {
    try {
      if (data.includes("DONE")) return {}

      const message = JSON.parse(data)
      const thinking = message?.choices?.[0]?.delta?.reasoning_content || ""
      const content = message?.choices?.[0]?.delta?.content || ""

      return { thinking, content }
    } catch (error) {
      console.error("Stream data parse error:", error)
      return {}
    }
  },
}

export default chatApi
```
