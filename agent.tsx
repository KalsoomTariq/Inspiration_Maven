
import React from 'react';
import {
  Agent,
  TTS,
  PendingActionEvent,
  Action,
} from 'react-agents';
import axios from "axios";
import { z } from 'zod'; 

const InspirationMaven = () => {
 
  const getBooksBySubject = async (subject, details = false, limit = 10) => {
      const url = `https://openlibrary.org/subjects/${subject}.json`;
      try {
        const response = await axios.get(url, {
          params: {
            details: details ? "true" : "false",
            limit: limit,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error.message);
        return null;
      }
    };
 
  return (
    <>
      <Action
      name='fetchBooksByCategory'
      description="Retrieve a list books by category"
      schema={ 
          z.object({ 
          subject: z.string(), 
          }) 
      } 
      examples={[ 
          {  
          subject: 'inspiration', 
          }, 
          {  
              subject: 'money', 
          }, 
      ]} 
      handler={ 
          async (e: PendingActionEvent) => { 
          const { subject } = e.data.message.args as { subject: string }; 
          const moves =await getBooksBySubject(subject, true, ); 
          const monologueString = `\ 
            Inspiration Maven searches for specific books based on subject and finds some books. 
            She picks the top book among them with her previous knowledge and recommends them to the user.
          ` + '\n\n' + moves; 
          await e.data.agent.monologue(monologueString);   
          await e.commit(); 
          } 
      } 
      /> 
    </>
  );
}

export default function MyAgent() {
  return (
    <Agent>
      <InspirationMaven />
      <TTS voiceEndpoint="elevenlabs:scillia:kNBPK9DILaezWWUSHpF9" />
    </Agent>
  );
}
