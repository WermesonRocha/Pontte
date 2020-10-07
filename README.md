FORMAT: 1A
HOST: https://southamerica-east1-pontte-challenge-b7be1.cloudfunctions.net/

# Pontte - API

Uma API simples criada com o intuito de resolver o desafio da Pontte. Se trata de uma API para a listagem, cadastro e edição de contratos de empréstimos.


Todos os recursos desta API foram construidos sobre a arquitetura Serverless, usando para tal o Firebase Cloud Functions. Para o armazenamento dos dados e arquivos foram utilizados o Cloud Firestore que é um banco de dados não relacional (NoSQL) e o Cloud Storage respectivamente. Essa escolha se deu pela facilidade para a integração com os serviços do Firebase Functions.

## Validação dos Dados [/validation]

Essa API conta com a validação de campos obrigatórios e também sobre os dados optativos, pois manter a integridade da base de dados é algo fundamental dentro da aplicação. As validações realizadas não são apenas da existência dos parâmetros, indo além. Exemplos:

* **Email (email)**: Utilizado uma regex que dá o match com o padrão *a@b.c*

* **CPF (cpf)**: Utilizado cálculo do módulo 11 para validar se os números enviados são de um documento válido

* **Valor do empréstimo (amount) e Renda mensal (monthlyIncome)**: Esses valores devem ser enviados como string e a API os considera no formato de *currency*, fazendo um tratamento desses dados antes de os inserir na base. Dessa forma, a string "100" em *currency* equivale ao valor de 1 real.


Alguns parâmetros optativos devem seguir um padrão para que sejam validados, sendo eles:

* **Endereço (address)**: 

        {

          "number": (obrigatório),
          
          "neighborhood": (obrigatório),
          
          "city": (obrigatório),
          
          "cep":  (obrigatório),
          
          "complement": ,
          
          "street":  (obrigatório),
          
          "state":  (obrigatório)
          
        }
        
* **Data de nascimento (birthDate)**: Utilizado uma regex que realiza a validação das datas, não aceitando datas inválidas como *45/12/2000*. O padrão utilizado é **dd/mm/aaaa**

* **Estado civil (maritalStatus)**: Valores válidos estão listados na lista ['']

## Sanitização dos Dados [/sanitization]

A manutenção de um padrão dos dados é essencial para o controle e utilização do banco. Desssa forma esta API realiza a sanitização dos dados recebidos, com o intuito de deixar os mesmos campos de todos os documentos com uma mesma formatação, sendo elas:

* **Nome e Estado civil**: Padronizado para o *upperCase*

* **Email**: Padronizado para o *lowerCase*

* **CPF**: Padronizado para com a máscara *xxx.xxx.xxx-xx*

* **Valor do empréstimo e Renda mensal**: Padronizado como *float*




## Recursos da API [/endpoints]

### Listar contratos [GET/list]

+ Response 200 (application/json)

        [
      {
        "state": string,
        "email": string,
        "birthDate": string,
        "monthlyIncome": number,
        "amount": number,
        "maritalStatus": string,
        "status": string,
        "address": {
          "number": number,
          "neighborhood": string,
          "city": string,
          "cep": string,
          "complement": string,
          "street": string,
          "state": string
        },
        "imgUrls": [...],
        "cpf": string,
        "uid": string,
        "name": string
      }
]

### Criar contrato [POST/create]

+ Request (application/json)

        {
            "amount": "150000",
            "cpf": "xxxxxxxxxxx",
            "email": "a@b.c",
            "name": "Wermeson Rocha da Silva",
            "monthlyIncome": "500000",
            "birthDate": "30/12/1997",
            "maritalStatus": "Single",
            "address": {
                "cep": "xxxxx-xxx",
                "street": "XXX",
                "number": 0,
                "complement": "",
                "neighborhood": "XX",
                "city": "XXX",
                "state": "XX"
            },
            "status": "Approved"
        }

+ Response 200 (application/json)

    + Body

            {
                "uid": "81e34817-eee1-4ecf-87ab-1014f2699611",
                "state": "creation",
                "amount": 1500,
                "cpf": "xxx.xxx.xxx-xx",
                "email": "a@b.c",
                "name": "WERMESON ROCHA DA SILVA",
                "monthlyIncome": 5000,
                "birthDate": "30/12/1997",
                "maritalStatus": "SINGLE",
                "address": {
                    "cep": "xxxxx-xxx",
                    "street": "XXX",
                    "number": 0,
                    "complement": "",
                    "neighborhood": "XX",
                    "city": "XXX",
                    "state": "XX"
                }
            }

### Upload de imagens [POST/uploadImages]

+ Request (multipart/form-data)

        {
            "userIdentification": file,
            "proofOfIncome": file,
            "propertyImage": file,
            "uid": "81e34817-eee1-4ecf-87ab-1014f2699611"
        }

+ Response 200 (application/json)

    + Body

            {
                "uid": "81e34817-eee1-4ecf-87ab-1014f2699611",
                "state": "upload images",
                "amount": 1500,
                "cpf": "xxx.xxx.xxx-xx",
                "email": "a@b.c",
                "name": "WERMESON ROCHA DA SILVA",
                "imgUrls": [ ... ],
                "monthlyIncome": 5000,
                "birthDate": "30/12/1997",
                "maritalStatus": "SINGLE",
                "address": {
                    "cep": "xxxxx-xxx",
                    "street": "XXX",
                    "number": 0,
                    "complement": "",
                    "neighborhood": "XX",
                    "city": "XXX",
                    "state": "XX"
                }
            }

### Aprovar/Desaprovar contrato [PUT/approval]

+ Request (application/json)

        {
            "uid": "81e34817-eee1-4ecf-87ab-1014f2699611",
            "status": "approved"
        }

+ Response 200 (application/json)

    + Body

            {
                "status": "APPROVED",
                "uid": "81e34817-eee1-4ecf-87ab-1014f2699611",
                "state": "upload images",
                "amount": 1500,
                "cpf": "xxx.xxx.xxx-xx",
                "email": "a@b.c",
                "name": "WERMESON ROCHA DA SILVA",
                "imgUrls": [ ... ],
                "monthlyIncome": 5000,
                "birthDate": "30/12/1997",
                "maritalStatus": "SINGLE",
                "address": {
                    "cep": "xxxxx-xxx",
                    "street": "XXX",
                    "number": 0,
                    "complement": "",
                    "neighborhood": "XX",
                    "city": "XXX",
                    "state": "XX"
                }
            }
            
### Atualizar informações do contrato [PUT/update]

+ Request (application/json)

        {
            "uid": "81e34817-eee1-4ecf-87ab-1014f2699611",
            "name": "Wermeson Silva"
        }

+ Response 200 (application/json)

    + Body

            {
                "uid": "81e34817-eee1-4ecf-87ab-1014f2699611",
                "state": "upload images",
                "amount": 1500,
                "cpf": "xxx.xxx.xxx-xx",
                "email": "a@b.c",
                "name": "WERMESON SILVA",
                "imgUrls": [ ... ],
                "monthlyIncome": 5000,
                "birthDate": "30/12/1997",
                "maritalStatus": "SINGLE",
                "address": {
                    "cep": "xxxxx-xxx",
                    "street": "XXX",
                    "number": 0,
                    "complement": "",
                    "neighborhood": "XX",
                    "city": "XXX",
                    "state": "XX"
                }
            }
            
### Atualizar imagens do contrato [PUT/updateImages]

+ Request (multipart/form-data)

        {
            "propertyImage": file,
            "uid": "81e34817-eee1-4ecf-87ab-1014f2699611"
        }

+ Response 200 (application/json)

    + Body

            {
                "uid": "81e34817-eee1-4ecf-87ab-1014f2699611",
                "state": "upload images",
                "amount": 1500,
                "cpf": "xxx.xxx.xxx-xx",
                "email": "a@b.c",
                "name": "WERMESON SILVA",
                "imgUrls": [ ... ],
                "monthlyIncome": 5000,
                "birthDate": "30/12/1997",
                "maritalStatus": "SINGLE",
                "address": {
                    "cep": "xxxxx-xxx",
                    "street": "XXX",
                    "number": 0,
                    "complement": "",
                    "neighborhood": "XX",
                    "city": "XXX",
                    "state": "XX"
                }
            }
