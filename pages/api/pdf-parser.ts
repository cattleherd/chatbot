import type { NextApiRequest, NextApiResponse } from "next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import path from "path";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import weaviate from "weaviate-ts-client";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { TokenTextSplitter } from "langchain/text_splitter";

// ... (previous imports and configurations)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Initialize Weaviate client
    const client = (weaviate as any).client({
      scheme: process.env.WEAVIATE_SCHEME || "https",
      host: process.env.WEAVIATE_HOST || "localhost",
    });

    // Using absolute path
    const filePath = path.join(process.cwd(), "public", "sample.pdf");

    // Loading PDF
    const loader = new PDFLoader(filePath, {
      pdfjs: (): Promise<any> => import("pdfjs-dist/legacy/build/pdf.js"),
    });

    const pdf = await loader.load();

    //grabbing all the text
    const result = pdf.map((document) => document.pageContent).join("");

    // preparing text splitter
    const splitter = new TokenTextSplitter({
      encodingName: "gpt2",
      chunkSize: 1000,
      chunkOverlap: 0,
    });

    //split text to smaller chunks,
    const documents = await splitter.createDocuments([result]);

    
    //extract all text
    let documentstext = documents.map(doc=>doc.pageContent)

    const store = await WeaviateStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        client,
        indexName: "RadwanAhmed",
        metadataKeys: ["mom"],
      }
    );

    //search for query
    const results = await store.similaritySearch("And more text. And more text. And more", 5);
    
    //results from query (just the text)
   const resultstext = results.map(e=>e.pageContent)


   /*await WeaviateStore.fromTexts(
  documentstext,
  [{ mom: "bar" }],
  new OpenAIEmbeddings(),
  {
    client,
    indexName: "RadwanAhmed",
    textKey: "text",
    metadataKeys: ["mom"],
  }
);*/

    res.status(200).send({ message: "Documents uploaded successfully" });
  } catch (err) {
    console.error("error in api", err);
    res.status(500).send({ err });
  }
}
