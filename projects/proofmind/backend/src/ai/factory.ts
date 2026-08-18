import { AIProvider } from "./provider";
import { MockAIProvider } from "./mock";
import { OpenAIProvider } from "./openai";
import { GroqProvider } from "./groq";
import { Config } from "../../../worker/src/config";

export class AIFactory {
  static create(config: Config): AIProvider {
    const providerType = (config.aiProvider || "mock").toLowerCase();
    
    if (providerType === "openai") {
      const apiKey = process.env.OPENAI_API_KEY || "test";
      return new OpenAIProvider(apiKey, process.env.AI_MODEL);
    }
    
    if (providerType === "groq") {
      const apiKey = config.groqApiKey || process.env.GROQ_API_KEY || "test";
      return new GroqProvider(apiKey, process.env.AI_MODEL);
    }
    
    // Default to Mock for offline tests
    return new MockAIProvider();
  }
}
