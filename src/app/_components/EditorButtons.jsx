'use client';


import { FaBold, FaCode, FaItalic } from 'react-icons/fa';
import { IoSparkles } from "react-icons/io5";
import { useAction, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { FaRegSave } from "react-icons/fa";

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api } from '../../../convex/_generated/api';
import { chatSession } from '@/gemini-model-config';


const EditorButtons = ({ editor }) => {


  const { id } = useParams();

  const { user } = useUser();


  const searchInVectorDBForSelectedTextAction = useAction(api.myActions.vectorSearchForTextInConvexDB);

  const saveNotesMutation = useMutation(api.notes.addNote);


  const onSelectedTextOnAiButtonClickAndPassTheTextToVectorDB = async () => {

    toast.success('your response is being generated...');

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    )

    const result = await searchInVectorDBForSelectedTextAction({
      text: selectedText,
      pdfFileId: id
    });


    const unFromattedAnswerFromConvexDBParse = JSON.parse(result);


    let unformattedAns = '';


    unFromattedAnswerFromConvexDBParse && unFromattedAnswerFromConvexDBParse.forEach((item) => {

      unformattedAns = unformattedAns + item.pageContent;

    });


    const promptForAIModel = `For question: ${selectedText} and with the given content as answer, please give appropriate and well written answer in plain text format. The answer content is: ${unformattedAns}`;

    const finalFormattedAnswerByGoogleGeminiFlashModel = await chatSession.sendMessage(promptForAIModel);

    const finalFormattedAnswerByGoogleGeminiFlashModelContent = finalFormattedAnswerByGoogleGeminiFlashModel?.response?.text();

    toast.success('your answer has been generated successfully');

    const allContentOfTheEditorTillNow = editor.getHTML();

    editor.commands.setContent(allContentOfTheEditorTillNow + `<p> <strong>Answer: </strong> ${finalFormattedAnswerByGoogleGeminiFlashModelContent} </p>`);


    saveNotesMutation({
      fileId: id,
      notes: editor.getHTML(), 
      emailOfTheUserCreatedTheNote: user.emailAddresses[0].emailAddress
    });
    
  }


  const saveChangesInDBOnClickFunc = () => {

    saveNotesMutation({
      fileId: id,
      notes: editor.getHTML(),
      emailOfTheUserCreatedTheNote: user.emailAddresses[0].emailAddress
    });

    toast.success('changes saved successfully');

  }
  
  
  return (
    <div className="p-5">


      <div className="control-group">


        <div className="button-group flex items-center gap-1">

          <TooltipProvider>

            <Tooltip>

              <TooltipTrigger asChild>

                <Button
                  variant="ghost"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive('bold') ? 'text-blue-600' : ''}
                >
                  <FaBold />

                </Button>

              </TooltipTrigger>

              <TooltipContent>
                <p>Bold the selected text</p>
              </TooltipContent>

            </Tooltip>

          </TooltipProvider>


          <TooltipProvider>

            <Tooltip>

              <TooltipTrigger asChild>

                <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'text-blue-600' : ''}
                >
                    <FaItalic />

                </Button>

              </TooltipTrigger>

              <TooltipContent>
                <p>Underline the selected text</p>
              </TooltipContent>

            </Tooltip>

          </TooltipProvider>


          <TooltipProvider>

            <Tooltip>

              <TooltipTrigger asChild>

                <Button
                  variant="ghost"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={editor.isActive('code') ? 'text-blue-600' : ''}
                >
                  <FaCode />

                </Button>

              </TooltipTrigger>

              <TooltipContent>
                <p>convert the selected text to code</p>
              </TooltipContent>

            </Tooltip>

          </TooltipProvider>


          <TooltipProvider>

            <Tooltip>

              <TooltipTrigger asChild>

                <Button 
                  variant='ghost'
                  onClick={() => onSelectedTextOnAiButtonClickAndPassTheTextToVectorDB()}
                  className='hover:text-blue-600'
                >

                  <IoSparkles />

                </Button>

              </TooltipTrigger>

              <TooltipContent>
                <p>Generate an answer for the selected text using AI</p>
              </TooltipContent>

            </Tooltip>

          </TooltipProvider>


          <TooltipProvider>

            <Tooltip>

              <TooltipTrigger asChild>

                <Button 
                  variant='ghost'
                  onClick={() => saveChangesInDBOnClickFunc()}
                  className='hover:text-blue-600'
                >

                  <FaRegSave />

                </Button>

              </TooltipTrigger>

              <TooltipContent>
                <p>Save Changes</p>
              </TooltipContent>

            </Tooltip>

          </TooltipProvider>


        </div>

      </div>

    </div>
  );
};


export default EditorButtons;
