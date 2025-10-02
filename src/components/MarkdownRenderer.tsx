import React from 'react';

const renderMakrdown = (text: string)  => {
    if(!text) return <p className="text-gray-500 italic">No content added yet...</p>;

    return text.split("\n").map((line, index) => {
      if(line.startsWith("# ")) {
        return <h1 key={index} className="text-3xl font-bold text-gray-900 mb-4 mt-6">{line.substring(2)}</h1>
      }
      if(line.startsWith("## ")) {
        return <h2 key={index} className="text-2xl font-semibold text-gray-800 mb-3 mt-5">{line.substring(3)}</h2>
      }
      if(line.startsWith("### ")) {
        return <h3 key={index} className="text-xl font-medium text-gray-700 mb-2 mt-4">{line.substring(4)}</h3>
      }

      if(line.startsWith("- ") || line.startsWith("* ")) {
        return(
          <li key={index} className="text-gray-700 mb-1 ml-4">
            {line.substring(2)}
          </li>
        );
      }

      if(line.trim() === '') {
        return <br key={index}/>;
      }

      return <p key={index} className="text-gray-700 mb-3">{line}</p>;
    });
};

export default renderMakrdown;