export default function({
    importGistId,
    cy,
    inquirer,
    fetchjsonp,
    document
}){
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'actionSnippet',
      message: 'Пример работы частей btr в node js cli, выбирите действие',
      choices: ['загрузить gist', 'commands cy'],
    },
  ])
  .then(answers => {
    console.info('Answer:', answers.actionSnippet);

    if(answers.actionSnippet === "загрузить gist"){
      importGistId(fetchjsonp, document, "ec73e04b5eef9f1ecfe68809867836cc").then(gists => {
        const mainJson = JSON.parse(gists[ "main.json"].text);
        const markdown = gists[ "markdown.md"].html;
        const alertJs = new Function('', gists[ "alert.js"].text);

        console.log("mainJson : ", mainJson);
        console.log("markdown : ", markdown);
        alertJs();
      });
    }

    if(answers.actionSnippet === "commands cy"){
        cy.log("тестируем комманды");
        cy.wait(5000);
        cy.log("должно выполниться через 5 секунд");
        cy.then(()=>{
          console.log("Все!");
        });
    }
});
}