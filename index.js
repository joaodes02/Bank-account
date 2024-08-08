// moudulos externos
const inquirer = require("inquirer");
const chalk = require("chalk");

// modulos internos
const fs = require("fs");

// console.log("Setup inicial");

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que voce deseja fazer?",
        choices: [
          "Criar conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];

      if (action === "Criar conta") {
        createAccount();
      } else if (action === "Depositar") {
        deposit();
      } else if (action === "Consultar Saldo") {
      } else if (action === "Sacar") {
      } else if (action === "Sair") {
        console.log(chalk.bgBlue.black("Obrigado por usar Bank-Account!"));
        process.exit();
      }
    })
    .catch((err) => console.log(err));
}

// Criando Conta

function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir: "));
  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite um nome para sua conta: ",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      console.info(accountName);

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black("Está conta já existe, escolha outro nome.")
        );
        buildAccount();
        return;
      }
      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance": 0}',
        function (err) {
          console.log(err);
        }
      );

      console.log(chalk.green("Parabéns, sua conta foi criada com sucesso!"));
      operation();
    })
    .catch((err) => console.log(err));
}

// Adicionando saldo na conta:

function deposit() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual nome da sua conta? ",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      // Verificando se a conta já existe:

      if (!checkAccount(accountName)) {
        return deposit();
      }

      // Adicionando saldo a conta:
      inquirer
        .prompt([
          {
            name: "amount",
            message: "Insira o valor que deseja depositar: ",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];
          // Chamando função de Adição de saldo:
          addAmount(accountName, amount);
          operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(
      chalk.bgRed.black("Está conta não existe, escolha outro nome!")
    );
    return false;
  }
  return true;
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorrou um erro! Tente novamente mais tarde")
    );
    return deposit();
  }
  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );
  console.log(
    chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`)
  );
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf8",
    flag: "r",
  });
  return JSON.parse(accountJSON);
}
