const lorealFotoProtecaoSaude = async () => {
  const phoneInput = document.getElementById("phone");
  const birthdateInput = document.getElementById("birthdate");
  const cpfInput = document.getElementById("cpf");
  const form = document.getElementById("registration-form");
  const submitButton = form.querySelector("button[type='submit']");

  // Máscaras para os campos
  IMask(phoneInput, { mask: "(00) 00000-0000" });
  IMask(cpfInput, { mask: "00000000000" });
  IMask(birthdateInput, {
      mask: '00/00/0000',
      blocks: { '0': { mask: IMask.MaskedRange, from: 0, to: 9 } },
  });

  // Remover caracteres não numéricos do CPF
  cpfInput.addEventListener('input', (e) => {
      const onlyNumbers = e.target.value.replace(/\D/g, '');
      e.target.value = onlyNumbers;
  });

  function transformDate(dateStr) {
      const [day, month, year] = dateStr.split("/");
      return `${day}-${month}-${year} 00:00:00.000`;
  }

  // Habilitar/desabilitar o select de colaboradores
  document.getElementById("invite-sim").addEventListener('change', () => {
      document.getElementById("collaborator").disabled = false;
  });
  document.getElementById("invite-nao").addEventListener('change', () => {
      document.getElementById("collaborator").disabled = true;
      document.getElementById("collaborator").selectedIndex = 0;
  });

  form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      
      const data = {
          deName: "tb_Pesquisa_PharmaRevolution",
          fields: {
              Nome: formData.get("firstName"),
              Sobrenome: formData.get("lastName"),
              CPF: formData.get("cpf"),
              Email: formData.get("email"),
              Nascimento: transformDate(formData.get("birthdate")),
              Telefone: formData.get("phone"),
              Ocupacao: formData.get("occupation"),
              Rede: formData.get("network"),
              Qual_colaborador: formData.get("collaborator"),
              Foi_convidado: formData.get("invite"),
          }
      };


      submitButton.disabled = true;
      submitButton.innerText = "ENVIANDO...";

      try {
          const response = await fetch("https://mc23wlq3mtfm1mbytpdvsrv-6kc4.pub.sfmc-content.com/adusphk4wvv", {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                  "Content-Type": "application/json"
              }
          });

          const responseText = await response.text();

          let responseData;
          try {
              responseData = JSON.parse(responseText);
              if (responseData.statusCode !== 200) {
                  console.error("Erro: E-mail já cadastrado!");
                  alert("Erro: E-mail já cadastrado!");
              } else {
                  // Ocultar o <h2> após o envio bem-sucedido
                  const h2Element = document.querySelector('h2'); // Seleciona o primeiro <h2> encontrado
                  if (h2Element) {
                      h2Element.style.display = 'none'; // Oculta o <h2>
                  }

                  // Mostrar mensagem de sucesso
                  form.innerHTML = `
                      <h1 style="text-align: center;">Cadastro Finalizado com sucesso!</h1>
                      <h1 style="text-align: center;">Obrigado por se registrar na L’Oréal Beleza Dermatológica!</h1>
                  `;
              }
          } catch (jsonError) {
              console.error("Erro ao analisar JSON:", jsonError);
              console.error("Resposta não JSON:", responseText);
              alert("Erro ao processar a resposta do servidor: " + responseText);
          }
      } catch (error) {
          console.error("Erro ao enviar os dados:", error);
          alert("Ocorreu um erro ao enviar os dados. Tente novamente.");
      } finally {
          submitButton.disabled = false;
          submitButton.innerText = "Enviar";
      }
  });
};

// Iniciar a função ao carregar a página
document.addEventListener("DOMContentLoaded", lorealFotoProtecaoSaude);
