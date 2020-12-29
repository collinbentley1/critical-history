import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import privacy from './privacy.md';



const AboutPrivacy = () => {
    // Declare state variable, for markdown
    const [ mdText, setText ] = useState({markdown: ''});

    useEffect( () => {
        fetch(privacy).then(res => res.text()).then(text => setText({ markdown: text }));

    }, []);

    //Link renderer: allow links to open in new tab
    function LinkRenderer(props) {
        return <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
    }

    const mdComponent = <ReactMarkdown 
                            source={mdText.markdown}
                            renderers={{link: LinkRenderer}}
                        />
 
    return (
        <div className="pl-5 pr-5 mb-3 about-text">
            {mdComponent}
        </div>
    )
}

export default AboutPrivacy