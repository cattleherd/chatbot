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

export default function Home() {
  const [data, setData] = useState(null);
  const [question, setQuestion] = useState<string>("");

  const handleQuestionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setQuestion(event.target.value);
  };

  // Define an async function to fetch data from the API route
  const fetchData = async () => {
    try {
      const response = await fetch("/api/openai", {
        method: "POST", //sending data to api must be post
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }), //must send as json object
      });
      //rate limiting set by openai api
      if (response.status === 429) {
        throw new Error("You may only send 10 questions per hour");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      alert(err.message);
    }
  };

  // Render the fetched data if available
  const renderData = () => {
    if (data) {
      return (
        <Box>
          <Text fontSize="md">{data}</Text>
        </Box>
      );
    }
  };
  return (
    <Container
      height={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Card width={"500px"} height={"500px"}>
        <CardHeader>
          <Heading size="md">Chatbot</Heading>
        </CardHeader>
        <CardBody>{renderData()}</CardBody>
        <CardFooter>
          <Textarea
            value={question}
            onChange={handleQuestionChange}
            mr={"20px"}
            placeholder="ask a question"
          ></Textarea>
          <Button height={"100%"} onClick={fetchData}>
            Query
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
}
