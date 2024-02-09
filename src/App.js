import { useState, useRef, useEffect } from 'react';
import { get, put, post, del } from 'aws-amplify/api';
import { CodeEditor } from './components/CodeEditor';
import { LangDropDown } from './components/LangDropDown';
import { TTLDropDown } from './components/TTLDropDown';
import { encrypt, decrypt } from './utils/encrypt';
import { SafeUrl } from './components/SafeUrl';
import ClipLoader from "react-spinners/ClipLoader";
import './App.css';



async function createEncryptedData(data=null, hash="", ttl=300) {
  if(data != null){
    try {
      const restOperation = post({ 
        apiName: 'awstoolkitapi',
        path: '/encrypted-data',
        options: {
          body: {
            "encrypted-data": data,
            "encryption-key-hash": hash,
            "expiration-date": (Math.floor(Date.now() / 1000) + Number(ttl)).toString()
          }
        } 
      });
      const { body } = await restOperation.response;
      return await body.json();
    } catch (error) {
      console.log('GET call failed: ', error);
    }
  }
}


async function updateEncryptedData(id, ttl=60) {
  try {
    const restOperation = put({ 
      apiName: 'awstoolkitapi',
      path: '/encrypted-data/' + id,
      options: {
        body: {
          "id": id,
          "encrypted-data": 'my updated secret data',
          "expiration-date": (Math.floor(Date.now() / 1000) + ttl).toString()
        }
      }
    });
    const response = await restOperation.response;
  } catch (error) {
    console.log('GET call failed: ', error);
  }
}


async function readEncryptedData(id) {
  try {
    const restOperation = get({ 
      apiName: 'awstoolkitapi',
      path: '/encrypted-data/' + id
    });
    const { body } = await restOperation.response;
    return await body.json();
  } catch (error) {
    console.log('GET call failed: ', error);
  }
}

async function deleteEncryptedData(id) {
  try {
    const restOperation = del({ 
      apiName: 'awstoolkitapi',
      path: '/encrypted-data/' + id
    });
    const response = await restOperation.response;
  } catch (error) {
    console.log('GET call failed: ', error);
  }
}

function App() {

  useEffect(() => {
    async function fetchData() {
      const itemCreds = checkHref()
      if (itemCreds.id) {
        try {
          let data = await readEncryptedData(itemCreds.id)
          let item = data.data.Item
          let decryptedData = decrypt(item, itemCreds.password)
          setText(decryptedData)
          let now = Math.floor(Date.now() / 1000)
          let expirationDate = Number(item['expiration-date'].N)
          if (now > expirationDate) {
            deleteEncryptedData(itemCreds.id)
          }
        } catch (error) {
          setText('')
        }
      }
    }
    fetchData()

  }, [])


  function checkHref () {
    let url = window.location.href
    let id = url.split('/')[3]
    let password = url.split('/')[4]
    return {id, password}
  }

  const [TTL, setTTL] = useState(0)
  const [buttonPopup, setButtonPopup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [safeUrl, setSafeUrl] = useState('')
  const [text, setText] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('python');

  async function encryptAndSend() {
    setLoading(true)
    setButtonPopup(true)
    let data=editorRef.current.getValue()
    let encryptedData = encrypt(data);
    let dataId = await createEncryptedData(
      encryptedData.crypt, encryptedData.hash, TTL
    )
    setSafeUrl([window.location.origin, dataId.message, encryptedData.encoded].join('/'))
    setLoading(false)
  }

  const handleLangDropDownChange = (e) => {
      setSelectedLanguage(e.target.value);
  }

  const handleTTLDropDownChange = (e) => {
      setTTL(e.target.value);
  }

  const editorRef = useRef(null)
  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }


  return <div className='Container'>
    <main>
      <LangDropDown onChange={handleLangDropDownChange} />
      <TTLDropDown onChange={handleTTLDropDownChange} />
      <button className="fileTab" onClick={() => encryptAndSend()}>Encrypt and Save</button>
      <CodeEditor language={selectedLanguage} onMount={handleEditorDidMount} text={text}/>
    </main>
    {!loading ?
    <SafeUrl trigger={buttonPopup} setTrigger={setButtonPopup} safeUrl={safeUrl}><p>{safeUrl}</p></SafeUrl> :
    <SafeUrl trigger={buttonPopup} setTrigger={setButtonPopup} safeUrl="">
      <ClipLoader className="loader" loading={loading} color='white'/>
    </SafeUrl>}
  </div>;
  
}

export default App;