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
import axios from "axios";
import { resolve } from "path";
import { useRef, useEffect, useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  /*
  // Define an async function to fetch data from the API route
  const fetchData = async () => {
    try {
      const response = await fetch("/api/questions", {
        method: "POST", //sending data to api must be post
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), //must send as json object
      });
      //rate limiting set by openai api
      if (response.status === 429) {
        throw new Error("You may only send 10 questions per hour");
      }
      const result = await response.json();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };
*/

  //send transfer file to state
  const handleFile = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  //send pdf to backend
  const injestpdf = async () => {
    if (!selectedFile) {
      alert("Insert a pdf file first");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await axios
        .post("/api/pdf-parser", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          console.log(res);
        });
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
                pr: "20px",
                borderRadius: "8px",
                backgroundColor: `white`,
                height: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: `rgba(0, 0, 0, 0.05)`,
              },
            }}
          ></CardBody>
          <CardFooter>
            <Textarea mr={"20px"} placeholder="ask a question"></Textarea>
            <input type="file" accept="pdf" onChange={handleFile} />
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
