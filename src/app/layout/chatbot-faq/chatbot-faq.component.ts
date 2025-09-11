import { Component, Input, OnInit } from '@angular/core';
import { ChatbotFaqService } from './chatbot-faq.service';

@Component({
  selector: 'app-chatbot-faq',
  templateUrl: './chatbot-faq.component.html',
  styleUrls: ['./chatbot-faq.component.scss']
})
export class ChatbotFaqComponent implements OnInit {
  document:any;

  chatbotToggler:any;
  chatbox:any;
  faqData:any;
  loadedQuestions = 0;
  chatbot: any;
  @Input() moduleId: any;
  constructor(
    private chatbotFaqService: ChatbotFaqService
  ) { }

  async ngOnInit() {
    this.document = document;



    const resData = this.chatbotFaqService.getData(this.moduleId);
    resData.then((res:any)=>{
      this.faqData = res;


      this.chatbotToggler = this.document.querySelector(".chatbot-toggler");
      this.chatbox = this.document.querySelector(".chatbox");

      console.log('faqData:::', this.faqData)
      this.resetChatbot('English');

      this.chatbotToggler.addEventListener("click", async () => {
        await this.toggleChatbot();
      });



    })




  }




  processData(csvData:any){
  const arr = csvData.split("\n");
  const objs = [];
  for (let i = 0; i < arr.length; i++) {
      if (i === 0) continue;
      const vals = arr[i].split(",");
      objs.push({
          category: vals[0],
          subcategory: vals[1],
          question: vals[2],
          answer: vals[3]
      });
  }
  return objs;
};

async resetChatbot(category:any){

  console.log('resetChatbot', category)
  this.loadedQuestions = 0; // Reset loaded questions counter
  this.chatbox.innerHTML = '';
  await this.loadSubcategories(category); // Fix typo here
};

loadSubcategories(selectedCategory:any){
  const tabs:any = this.document.getElementsByClassName('tab');

  console.log('tabs:::', tabs)

  for (let tab of tabs) {
    console.log('::::', {
      textContent: tab.textContent,
      selectedCategory: selectedCategory,
    })
      if (tab.textContent === selectedCategory) tab.classList.add('tab-active');
      else tab.classList.remove('tab-active');
  }

  this.chatbox.innerHTML = '';

  const subcategories = [...new Set(this.faqData.filter((row:any) => row.Category === selectedCategory).map((row:any) => row.Subcategory))];

  console.log('subcategories:::', subcategories)
  const buttonContainer = this.document.createElement("div");
  buttonContainer.classList.add("menu-button-container");

  subcategories.forEach(subcategory => {
      const subcategoryButton:any = this.document.createElement("div");
      subcategoryButton.textContent = subcategory;
      subcategoryButton.addEventListener("click", () => this.chooseSubcategory(selectedCategory, subcategory));
      buttonContainer.appendChild(subcategoryButton);
  });

  this.chatbox.appendChild(buttonContainer);
};

chooseSubcategory(category:any, subcategory:any){
  this.loadedQuestions = 0; // Reset loaded questions counter
  this.chatbox.innerHTML = '';

  const questions = this.faqData.filter((row:any) => row.Category === category && row.Subcategory === subcategory);

  this.loadQuestions(category, subcategory, questions);


};

loadQuestions(category:any, subcategory:any, questions:any){
  // Remove Load More and Main Menu buttons if they already exist.
  let loadMoreButton = this.document.getElementById("loadMoreButton");
  if (loadMoreButton) loadMoreButton.remove();

  let mainMenuButton = this.document.getElementById("mainMenuButton");
  if (mainMenuButton) mainMenuButton.remove();

  const buttonContainer = this.document.createElement("div");
  buttonContainer.classList.add("question-button-container");

  for (let i = this.loadedQuestions; i < this.loadedQuestions + 5 && i < questions.length; i++) {
      const questionButton = this.document.createElement("button");
      questionButton.textContent = questions[i].Question;
      questionButton.addEventListener("click", () => {
        this.displayAnswer(questions[i].Question, questions[i].Answer);
        questionButton.setAttribute("disabled", true);
        questionButton.classList.add("questionClicked");
      });
      buttonContainer.appendChild(questionButton);
  }


  this.chatbox.appendChild(buttonContainer);

  this.loadedQuestions += 5;

  if (this.loadedQuestions < questions.length) {
      loadMoreButton = this.createButton("Load More", () => this.loadQuestions(category, subcategory, questions));
      loadMoreButton.setAttribute('id', 'loadMoreButton')
      this.chatbox.appendChild(loadMoreButton);
  }

  mainMenuButton = this.createButton("Main Menu", () => this.loadSubcategories(category));
  mainMenuButton.setAttribute('id', 'mainMenuButton')
  this.chatbox.appendChild(mainMenuButton);

  this.chatbox.scrollTop = this.chatbox.scrollHeight; // Scroll to the bottom after appending
};



createButton(text:any, clickHandler:any){
  const button = this.document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", clickHandler);
  button.classList.add("chatbot-button"); // Add a class for styling consistency
  return button;
};

displayAnswer(question:any, answer:any){
  const userQuestion = this.document.createElement('div');
  userQuestion.classList.add("singleQuestionContainer");
  userQuestion.innerHTML = `${question}`;
  this.chatbox.appendChild(userQuestion);

  const botAnswer = this.document.createElement('div');
  botAnswer.classList.add("singleAnswerContainer");
  botAnswer.innerHTML = `${answer.replace(/>/g, '<br>')}`;
  this.chatbox.appendChild(botAnswer);

  // Remove old Main Menu button
  this.removeOldMainMenuButton();

  // Create and append Main Menu button after the answer
  let mainMenuButton = this.createButton("Main Menu", () => {
    if(document){
      const selectedCategory = this.document.querySelector('.tab.tab-active').textContent;
      this.loadSubcategories(selectedCategory);
    }

  });
  mainMenuButton.setAttribute('id', 'mainMenuButton')
  this.chatbox.appendChild(mainMenuButton);

  this.chatbox.scrollTop = this.chatbox.scrollHeight;
};


removeOldMainMenuButton(){
  let oldMainMenuButton = this.document.getElementById("mainMenuButton");
  if (oldMainMenuButton) oldMainMenuButton.remove();
}





// faqData = processData(data);


// Function to toggle the chatbot
async toggleChatbot(){
  console.log('click toggle');
  const chatbot:any = this.document.querySelector(".chatbot");

  // Check if the chatbot is already open, if so, close it
  if (chatbot.classList.contains('open')) {
      chatbot.classList.remove('open');
  } else {
      // If it's closed, reset and then open with a delay
      await this.resetChatbot('English');
      setTimeout(() => {
          chatbot.classList.add('open');
      }, 100);
  }
};



displayMainMenu(){
  const selectedCategory = this.document.querySelector('.tab.tab-active').textContent;
  this.loadSubcategories(selectedCategory);
};

closeChatbot(){
  this.chatbot = this.document.querySelector(".chatbot");
  this.chatbot.classList.remove('open');
  this.resetChatbot('English'); // Reset the chatbot when it's closed
};









}
