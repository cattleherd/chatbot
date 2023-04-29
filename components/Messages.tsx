import { Box, Text } from "@chakra-ui/react";
import React from "react";


//function renders the display of messages (ai generated and user generated)

export default function MessageList({ messages }: MessageListProps) {
  return (
    <Box>
      {messages.message.map((e, index) =>
        e.type === "userMessage" ? (
          <Box display={"flex"} justifyContent={"end"}>
            <Text key={index} backgroundColor={'gray.100'} my={'20px'} px={'10px'} py={'10px'} rounded={'md'} color={'black'}>{e.message}</Text>
          </Box>
        ) : (
          <Box display={'flex'}><Text backgroundColor={'gray.600'} px={'10px'} py={'10px'} rounded={'md'} color={'white'} key={index}>{e.message}</Text></Box>         
        )
      )}
    </Box>
  );
}
