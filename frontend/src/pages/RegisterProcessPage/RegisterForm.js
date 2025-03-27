import React, { useState, useEffect } from "react";
import styles from "./RegisterForm.module.css";
import { postProcess } from "../../services/processService";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Form() {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    return savedData
      ? JSON.parse(savedData)
      : {
          Pcss_NumeroProcesso: "",
          Pcss_Siged: "",
          Pcss_Observacoes: "",
          Pcss_Destino: "",
          Pcss_Requerente: "",
          Pcss_Requerido: "",
          Pcss_ValorAcao: "",
          Pcss_DataEmitido: "",
          Pcss_DataVencimento: "",
          tipo: "",
          Pass_Assuntos: "",
          Pjud_Vara: "",
          Pjud_LocalAudiencia: "",
          Pjud_DataAudiencia: "",
          Pjud_DataIntimacao: "",
          categoria: "",
          prazoCorrido: null,
          prazo: "",
        };
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "prazoCorrido" ? value === "true" : value,
    }));
  };

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    switch (formData.categoria) {
      case "mandado_seguranca":
        setFormData((prev) => ({ ...prev, prazo: "30", prazoCorrido: true }));
        break;
      case "juizado_especial":
        setFormData((prev) => ({ ...prev, prazo: "15", prazoCorrido: false }));
        break;
      case "acao_ordinaria":
        setFormData((prev) => ({ ...prev, prazo: "30", prazoCorrido: false }));
        break;
      case "outro":
        setFormData((prev) => ({ ...prev, prazo: "", prazoCorrido: null }));
        break;
      default:
        break;
    }
  }, [formData.categoria]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const assuntos = formData.Pass_Assuntos.split(",").map((a) => a.trim());

      const response = await postProcess({
        ...formData,
        prazo: parseInt(formData.prazo),
        Pass_Assuntos: assuntos,
        Pjud_DataIntimacao: formData.Pjud_DataIntimacao,
        Pjud_DataAudiencia: formData.Pjud_DataAudiencia,
      });

      console.log("response", response);
      if (response) {
        alert("Processo cadastrado com sucesso!");
        setFormData({
          Pcss_NumeroProcesso: "",
          Pcss_Siged: "",
          Pcss_Observacoes: "",
          Pcss_Destino: "",
          Pcss_Requerente: "",
          Pcss_Requerido: "",
          Pcss_ValorAcao: "",
          Pcss_DataEmitido: "",
          Pcss_DataVencimento: response.data.Pcss_DataVencimento,
          tipo: "",
          Pass_Assuntos: "",
          Pjud_Vara: "",
          Pjud_LocalAudiencia: "",
          Pjud_DataAudiencia: "",
          Pjud_DataIntimacao: "",
          categoria: "",
          prazoCorrido: null,
          prazo: "",
        });
        localStorage.removeItem("formData");
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar processo. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.form_container}>
      <form onSubmit={handleSubmit}>
        {/* Informações básicas */}

        <section>
          <div className={styles.form_group}>
            <select onChange={handleChange} value={formData.tipo} name="tipo">
              <option value="">Tipo de processo</option>
              <option value="pjud">Processo Judicial</option>
              <option value="pnjud">Processo não Judicial</option>
            </select>
          </div>

          <h3>Informações básicas:</h3>
          <div className={styles.form_row}>
            <div className={styles.form_group}>
              <label>Siged</label>
              <input
                type="text"
                placeholder="Nº do Siged"
                name="Pcss_Siged"
                value={formData.Pcss_Siged}
                onChange={handleChange}
              />
            </div>

            <div className={styles.form_group}>
              <label>Nº do processo</label>
              <input
                type="text"
                placeholder="Nº do processo"
                name="Pcss_NumeroProcesso"
                value={formData.Pcss_NumeroProcesso}
                onChange={handleChange}
              />
            </div>

            <div className={styles.form_group}>
              <label>Vara</label>
              <input
                type="text"
                placeholder="Vara"
                name="Pjud_Vara"
                value={formData.Pjud_Vara}
                onChange={handleChange}
                disabled={!(formData.tipo === "pjud")}
              />
            </div>

            <div className={styles.form_group}>
              <label>Destino</label>
              <input
                type="text"
                placeholder="Destino"
                name="Pcss_Destino"
                value={formData.Pcss_Destino}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.form_row}>
            <div className={styles.form_group}>
              <label>Categoria</label>
              <select onChange={handleChange} value={formData.categoria} name="categoria">
                <option value=""></option>
                <option value="acao_ordinaria">Ação Ordinária</option>
                <option value="juizado_especial">Juizado Especial</option>
                <option value="mandado_seguranca">Mandado de Segurança</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className={styles.form_group}>
              <label>Prazo</label>
              <input
                type="text"
                placeholder="Prazo"
                name="prazo"
                value={formData.prazo}
                onChange={handleChange}
                disabled={!(formData.categoria === "outro")}
              />
            </div>
            <div className={styles.form_group}>
              <div className={styles.form_radio}>
                <input
                  type="radio"
                  name="prazoCorrido"
                  value={true}
                  onChange={handleChange}
                  disabled={!(formData.categoria === "outro")}
                  checked={formData.prazoCorrido}
                />

                <label>corridos</label>
              </div>

              <div className={styles.form_radio}>
                <input
                  type="radio"
                  name="prazoCorrido"
                  value={false}
                  onChange={handleChange}
                  disabled={!(formData.categoria === "outro")}
                  checked={formData.prazoCorrido === false}
                />
                <label>úteis</label>
              </div>
            </div>

            <div className={styles.form_group}>
              <label>Valor da ação</label>
              <input
                type="text"
                placeholder="Valor do processo"
                name="Pcss_ValorAcao"
                value={formData.Pcss_ValorAcao}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <div className={styles.form_row}>
          <div className={styles.form_group}>
            <label>Assuntos</label>
            <input
              type="char"
              placeholder="Assuntos"
              name="Pass_Assuntos"
              value={formData.Pass_Assuntos}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* Datas */}
        <section>
          <h3 className={styles.h3_datas}>Datas:</h3>
          <div className={styles.form_row}>
            <div className={styles.form_group}>
              <label>Data de Emissão</label>
              <DatePicker
                selected={formData.Pcss_DataEmitido}
                onChange={(date) => setFormData({ ...formData, Pcss_DataEmitido: date })}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecione a data"
                className={styles.date_input}
                locale="pt-BR" // Configura para português
              />
            </div>
            <div className={styles.form_group}>
              <label>Data de Vencimento</label>
              <input
                readOnly
                type="date"
                placeholder="Data de Vencimento"
                name="Pcss_DataVencimento"
                value={formData.Pcss_DataVencimento}
                onChange={handleChange}
              />
              {loading && <span className={styles.loading}>Calculando prazo...</span>}
            </div>
            <div className={styles.form_group}>
              <label>Data de Intimação</label>
              <input
                type="date"
                placeholder="Data de intimação"
                name="Pjud_DataIntimacao"
                value={formData.tipo === "pnjud" ? "" : formData.Pjud_DataIntimacao}
                onChange={handleChange}
                disabled={!(formData.tipo === "pjud")}
              />
            </div>

            <div className={styles.form_group}>
              <label>Data da Audiência</label>
              <input
                type="date"
                placeholder="Data da audiência"
                name="Pjud_DataAudiencia"
                value={formData.tipo === "pnjud" ? "" : formData.Pjud_DataAudiencia}
                onChange={handleChange}
                disabled={!(formData.tipo === "pjud")}
              />
            </div>

            <div className={styles.form_group}>
              <label>Local da Audiência</label>
              <input
                type="text"
                placeholder="Local da audiência"
                name="Pjud_LocalAudiencia"
                value={formData.Pjud_LocalAudiencia}
                onChange={handleChange}
                disabled={!(formData.tipo === "pjud")}
              />
            </div>
          </div>
        </section>

        {/* Partes Interessadas */}
        <section>
          <h3>Partes Interessadas:</h3>
          <div className={styles.form_row}>
            <div className={styles.form_group}>
              <label>Requerente</label>
              <input
                type="text"
                placeholder="Requerente"
                name="Pcss_Requerente"
                value={formData.Pcss_Requerente}
                onChange={handleChange}
              />
            </div>
            <div className={styles.form_group}>
              <label>Requerido</label>
              <input
                type="text"
                placeholder="Requerido"
                name="Pcss_Requerido"
                value={formData.Pcss_Requerido}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Observações */}
        <section>
          <h3>Observações:</h3>
          <textarea
            placeholder="Digite aqui as observações"
            className={styles.observation}
            name="Pcss_Observacoes"
            value={formData.Pcss_Observacoes}
            onChange={handleChange}></textarea>
        </section>

        {/* Botões */}
        <div className={styles.form_buttons}>
          <button type="button" onClick={() => navigate("/process")}>Voltar</button>
          <button
            type="reset"
            onClick={() =>
              setFormData({
                Pcss_NumeroProcesso: "",
                Pcss_Siged: "",
                Pjud_Vara: "",
                Pcss_Destino: "",
                Pcss_ValorAcao: "",
                Pjud_DataIntimacao: "",
                Pjud_DataAudiencia: "",
                Pjud_LocalAudiencia: "",
                Pcss_Requerente: "",
                Pcss_Requerido: "",
                Pcss_Observacoes: "",
              })
            }>
            Descartar
          </button>
          <button type="submit">Cadastrar</button>
        </div>
      </form>
    </div>
  );
}

export default Form;
