'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { ImSpinner2 } from 'react-icons/im';
import { useQuery } from 'convex/react';

import EditorButtons from './EditorButtons';
import { api } from '../../../convex/_generated/api';
import { useEffect } from 'react';


const TextEditor = ({ fileId }) => {


  const getAllContentOfTheCurrentNoteBasedOnTheFileIdQuery = useQuery(api.notes.getNoteForAParticularFileId, {
    fileId: fileId
  });


  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start taking your notes here...',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'h-screen p-5', 
      },
    },
    immediatelyRender: false,
  });


  useEffect(() => {

    if(editor && getAllContentOfTheCurrentNoteBasedOnTheFileIdQuery !== undefined) {

      editor.commands.setContent(getAllContentOfTheCurrentNoteBasedOnTheFileIdQuery);
  
    };

  }, [editor && getAllContentOfTheCurrentNoteBasedOnTheFileIdQuery])


  if (!editor) {
    return (
      <div className="min-h-screen flex flex-col items-center gap-4 mt-20">

        <ImSpinner2 className="text-5xl transition-all animate-spin duration-1000" />

        <p className="tracking-wider text-lg">Loading the Text Editor...</p>

      </div>
    );
  }


  return (
    <>
      
      <EditorButtons editor={editor} />

      <EditorContent editor={editor} className='h-[60vh] lg:h-[80vh] overflow-y-auto' />

    </>
  );
};

export default TextEditor;
