import { encode, decode } from "gpt-tokenizer/model/davinci-002";
import { icp_gpt2 } from "../../declarations/icp_gpt2";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("form");
  const button = form.querySelector("button");
  const outputSection = document.getElementById("greeting");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputText = document.getElementById("name").value;
    button.setAttribute("disabled", true);
    outputSection.innerText = "Processing...";

    // Tokenize input text
    const tokenIds = encode(inputText);

    try {
      // Call the backend for inference
      const maxTokens = 10;
      const response = await icp_gpt2.model_inference(maxTokens, tokenIds);
      console.log("Raw response:", response);

      // Directly process response.ok assuming it's defined
      const responseOk = response.Ok;
      console.log("response.ok:", responseOk);

      // Convert BigInt64Array to a regular array of numbers
      const tokenArray = Array.from(responseOk, (token) => Number(token));
      console.log("Token array:", tokenArray);

      // Decode tokens back to text
      const generatedText = decode(tokenArray);
      console.log("Generated text:", generatedText);
      outputSection.innerText = generatedText;
    } catch (error) {
      outputSection.innerText = "Error generating text";
      console.error("Error in inference:", error);
    }

    button.removeAttribute("disabled");
  });
});
