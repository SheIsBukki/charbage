import markdownIt from "markdown-it";
import hljs from "highlight.js";

const md = new markdownIt({
  highlight: (code, lang) => {
    const language = lang && hljs.getLanguage(lang) ? lang : "js";

    try {
      const highlightedCode = hljs.highlight(code, {
        language: language,
        ignoreIllegals: true,
      }).value;

      return `<pre class="hljs"><code>${highlightedCode}</code></pre>`;
    } catch (error) {
      console.log(error);
      return "";
    }
  },
});

export default md;
