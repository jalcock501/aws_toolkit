import './css/DropDown.css';

export const LangDropDown = ({onChange}) => {
    return (
            <select className="LangDropDown" onChange={onChange}>
                <option value="plaintext">Select Language</option>
                <option value="c">C</option>
                <option value="c++">C++</option>
                <option value="c#">C#</option>
                <option value="css">CSS</option>
                <option value="dart">Dart</option>
                <option value="dockerfile">Dockerfile</option>
                <option value="f#">F#</option>
                <option value="go">Go</option>
                <option value="html">HTML</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
                <option value="json">JSON</option>
                <option value="julia">Julia</option>
                <option value="less">Less</option>
                <option value="markdown">Markdown</option>
                <option value="php">PHP</option>
                <option value="plain text">Plain Text</option>
                <option value="powershell">PowerShell</option>
                <option value="python">Python</option>
                <option value="r">R</option>
                <option value="ruby">Ruby</option>
                <option value="rust">Rust</option>
                <option value="scss">SCSS</option>
                <option value="sql">SQL</option>
                <option value="typescript.">TypeScript</option>
                <option value="xml">XML</option>
                <option value="yaml">YAML</option>
            </select>
    )
}

