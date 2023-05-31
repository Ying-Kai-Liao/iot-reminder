import { Configuration, OpenAIApi } from "openai";

const openai = () => {
    const configuration = new Configuration({
    organization: "org-24h2Fum152gbSpgl51dT0XX4",
    apiKey: process.env.OPENAI_API_KEY,
        });
    const openai = new OpenAIApi(configuration);
    const response =  async () => openai.listModels();
}

export default openai;