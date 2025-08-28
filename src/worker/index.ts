import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// 代理房源列表API
app.post("/api/v1.0/app/gzf/house/list", async (c) => {
  const targetUrl = "https://select.pdgzf.com/api/v1.0/app/gzf/house/list";
  
  try {
    const requestBody = await c.req.json();
    
    // 简单的代理，直接转发请求
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API请求失败:", response.status, errorText);
      return c.json({ 
        error: "API request failed", 
        status: response.status,
        message: errorText 
      }, 500);
    }
    
    const data = await response.json() as any;
    return c.json(data);
  } catch (error) {
    console.error("代理请求失败:", error);
    return c.json({ 
      error: "Proxy request failed", 
      message: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
});

export default app;
