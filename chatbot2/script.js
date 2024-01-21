const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let userMessage = null;
const API_KEY = "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"; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{
                role: "user",
                content: userMessage
            }, ]
        })
    }
    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            const isMentalHealthRelated = checkIfMentalHealthRelated(data.choices[0].message.content);
            if (isMentalHealthRelated) {
                messageElement.textContent = data.choices[0].message.content.trim();
            } else {
                messageElement.classList.add("error");
                messageElement.textContent = "Sorry, I can't provide information on that topic.";
            }
        })
        .catch(() => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const checkIfMentalHealthRelated = (content) => {
    const greetingsKeywords = ["hi", "hii", "hey"];
    const mentalHealthKeywords = ["mental health", "emotional well-being", "greetings", "anxiety", "depression", "suicide", "mental illness", "sad", "friends", "trauma", "therapy" /* Add more keywords */ ];

    // Check if the content includes any greetings keywords
    const isGreeting = greetingsKeywords.some(greeting => content.toLowerCase().includes(greeting));

    // Check if the content includes any mental health keywords
    const isMentalHealthRelated = mentalHealthKeywords.some(keyword => content.toLowerCase().includes(keyword));

    return isGreeting || isMentalHealthRelated;
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
