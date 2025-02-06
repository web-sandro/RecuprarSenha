mongoose.connect('mongodb://localhost:27017/photo_upload_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    input.type === "password"
      ? (input.type = "text")
      : (input.type = "password");
    input.type === "password"
      ? (input.nextElementSibling.textContent = "👁️")
      : (input.nextElementSibling.textContent = "🙈");
  }

  function toggleIconVisibility() {
    var mensagem = document.getElementById("mensagem");
    var icon = document.getElementById("icon-upload");
    if (mensagem.value.trim() !== "") {
      icon.classList.add("hidden");
    } else {
      icon.classList.remove("hidden");
    }
  }

    document.getElementById('userForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const form = event.target; // Referência ao formulário
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
            });

            if (response.ok) {
                alert('Usuário cadastrado com sucesso!');
                form.reset(); // Limpa o formulário
            } else {
                const errorData = await response.json();
                alert(`Erro ao cadastrar: ${errorData.message || 'Ocorreu um erro.'}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao cadastrar o usuário.');
        }
    });

