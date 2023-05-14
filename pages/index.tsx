import { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Heading,
  Text,
  Container,
  Textarea,
} from "@chakra-ui/react";
import { useRef, useEffect } from "react";

import MessageList from "@/components/Messages";

export default function Home() {
<<<<<<< HEAD
<<<<<<< HEAD
  const [messages, setMessages] = useState({
    //initial state
    message: [{ message: "I am a simple chatbot, with chatgpt-4 under the hood. Ask me anything!", type: "aiMessage" }],
=======
  const [messages, setMessages] = useState({
    //initial state
    message: [{ message: "How are you", type: "aiMessage" }],
>>>>>>> parent of 9a5d589 (first commit)
  });

  const [question, setQuestion] = useState<string>(""); //user question

  //scroll to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //load question to state
  const handleQuestionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setQuestion(event.target.value);
  };

<<<<<<< HEAD
=======
  const [selectedFile, setSelectedFile] = useState(null);
  /*
>>>>>>> 9a5d58966d50e79612b68e69f3e8726f09250116
=======
>>>>>>> parent of 9a5d589 (first commit)
  // Define an async function to fetch data from the API route
  const fetchData = async () => {
    //update ui with user question to be displayed
    setMessages((prevState) => ({
      message: [
        ...prevState.message,
        { message: question, type: "userMessage" },
      ],
    }));
    setQuestion("");
    try {
      //call api with user question
      const response = await fetch("/api/questions", {
        method: "POST", //sending data to api must be post
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, messages }), //must send as json object
      });
      //rate limiting set by openai api
      if (response.status === 429) {
        throw new Error("You may only send 20 questions per hour");
      }
      const result = await response.json();

      //update messages with ai response
      setMessages((prevState) => ({
        message: [...prevState.message, { message: result, type: "aiMessage" }],
      }));
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  const injestpdf = async () => {
    try {
      const response = await fetch("/api/pdf-parser", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Container
        height={"100vh"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Card width={"500px"} height={"500px"}>
          <CardHeader>
            <Heading size="md">ChatBot</Heading>
          </CardHeader>
          <CardBody
            overflowY={"scroll"}
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
                pr:"20px",
                borderRadius: "8px",
                backgroundColor: `white`,
                height:'10px',
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: `rgba(0, 0, 0, 0.05)`,
              },
            }}
          >
            <MessageList messages={messages.message} />
            <div ref={messagesEndRef} />
          </CardBody>
          <CardFooter>
            <Textarea
              value={question}
              onChange={handleQuestionChange}
              mr={"20px"}
              placeholder="ask a question"
            ></Textarea>
            <Button
              height={"60%"}
              onClick={fetchData}
              width={"100px"}
              fontSize={"smaller"}
            >
              Query
            </Button>
            <Button
              height={"60%"}
              marginLeft={"20px"}
              width={"100px"}
              fontSize={"smaller"}
              onClick={injestpdf}
            >
              Injest pdf
            </Button>
          </CardFooter>
        </Card>
      </Container>
    </>
  );
}
