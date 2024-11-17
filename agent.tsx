
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
    {/* Action To Fetch Books based on the subject user is interested in */}
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
      {/* Action To Gauge User's Life Aspirations */}
    <Action
        name='gaugeUserAspirations'
        description="A personality and aspiration analysis of the user"
        schema={ 
            z.object({ 
            prompt: z.string(), 
            }) 
        } 
        examples={[ 
            {  
              prompt: 'I\'m feeling uncertain about my career path. I\’ve always been interested in art, but I also have a strong analytical side that draws me toward technology. I want to combine my love for creativity with my skills in problem-solving. ', 
            }, 
            {  
              prompt: 'I\’m trying to focus on self-improvement, particularly in terms of building resilience and understanding my emotions. I\’m looking for resources that could guide me in developing better emotional intelligence and handling difficult situations more effectively.', 
            }, 
        ]} 
        handler={ 
            (e: PendingActionEvent) => { 
            const { prompt } = e.data.message.args as { prompt: string }; 
            const monologueString = `\ 
              1. Analyzes User's Prompt to gauge user's life goals and inspirations.
                  a. If prompt does not contain any useful information, gently ask the user questions about their life goals and choices.
                  b. If prompt contains useful information, analyze the user's goals, aspirations, and current situation.
              2. Ask the user if they want a book recommendation that will help them in achieving their goals.
            ` + '\n\n <prompt>' + prompt + '</prompt>'; 
            e.data.agent.monologue(monologueString);   
            e.commit(); 
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
