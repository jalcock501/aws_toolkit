import { Editor } from "@monaco-editor/react";
import { useEffect } from "react";
import './css/CodeEditor.css';

const welcomeMessage =`"""
    Hi, and welcome to my client-side encrypted data store!
    This data store encrypts your data on the client side before sending it to the server.
    This means that the server never sees your unencrypted data.
    The server also doesn't know your encryption key, so it can't decrypt your data.
    This is a good way to store sensitive data in the cloud.

    You can use this tool to store secrets, passwords, and other sensitive data.
    You can also use it to share secrets with others.
    Just send them the URL and the password, and they can decrypt the data.

    The data will be deleted after it's read, or after a set amount of time.
    You can set the time to live (TTL) for the data.
    The default TTL is 0 seconds.
    This means the data will be deleted after it's read.
    You can also set the TTL to a specific amount of time.
    The TTL is set in seconds.
    The maximum TTL is 604800 seconds (1 week).

    You can also set the language for the code editor.
    The default language is Python.
    You can select from a list of languages in the drop-down menu.
    The data will be encrypted using the selected language.
"""`

export const CodeEditor = ({language, onMount, text='', loading=false}) => {

    useEffect(() => {
        if (text) {
            let placeholder = document.getElementById('placeholder');
            placeholder.className = "placeholderHidden";
        }
    })

    const handleEditorOnChange = (value, event) => {
        let placeholder = document.getElementById('placeholder');
        if (value) {
            placeholder.className = "placeholderHidden";
        }
    }
    return (
        <div>
            <Editor
        height="90vh"
        width="100%"
        theme="vs-dark"
        language= {language}
        onMount={onMount}
        onChange={handleEditorOnChange}
        value={text}
        options={{
            wordWrap: 'on',
            minimap: { enabled: true }
        }}
        />
        <p id="placeholder" className="topleft">{!loading ? welcomeMessage : "loading..."}</p> 
        </div>
    );
};
