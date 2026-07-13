import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useIniciarIntento, useRegistrarRespuestasIntento, useProgresoDelCurso } from '../../../application/hooks/useProgreso'
import type { Pregunta, ResultadoIntento } from '../../../domain/entidades'
import { Card, CardContent } from '../../componentes/ui/Card'
import { Button } from '../../componentes/ui/Button'

export default function PaginaEstudianteQuiz() {
  const { idCurso, idItem } = useParams<{ idCurso: string; idItem: string }>()
  const navigate = useNavigate()
  const idCursoNum = parseInt(idCurso!)

  const { data: progreso } = useProgresoDelCurso(idCursoNum)
  const { mutate: iniciar, isPending: iniciando } = useIniciarIntento()
  const { mutate: registrar, isPending: registrando } = useRegistrarRespuestasIntento()

  const [intentoId, setIntentoId] = useState<number | null>(null)
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [respuestas, setRespuestas] = useState<Record<number, number>>({})
  const [resultado, setResultado] = useState<ResultadoIntento | null>(null)
  const [idQuiz, setIdQuiz] = useState<number | null>(null)

  function handleIniciar() {
    if (!progreso?.id_inscripcion || !idItem) return
    iniciar(
      { id_inscripcion: progreso.id_inscripcion, id_quiz: parseInt(idItem!) },
      {
        onSuccess: (data) => {
          setIntentoId(data.intento.id)
          setPreguntas(data.preguntas)
          setIdQuiz(data.intento.id_quiz)
        },
      }
    )
  }

  function handleSeleccionar(idPregunta: number, idOpcion: number) {
    setRespuestas((prev) => ({ ...prev, [idPregunta]: idOpcion }))
  }

  function handleEnviar() {
    if (!intentoId || !idQuiz) return
    const respArray = Object.entries(respuestas).map(([idP, idO]) => ({
      id_pregunta: parseInt(idP),
      id_opcion_seleccionada: idO,
    }))
    registrar(
      { id: intentoId, respuestas: respArray, id_quiz: idQuiz },
      { onSuccess: (res) => setResultado(res) }
    )
  }

  const todasRespondidas = preguntas.every((p) => respuestas[p.id] !== undefined)

  if (resultado) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="max-w-lg mx-auto text-center py-12">
          <div className={`text-6xl mb-4 ${resultado.puntaje >= 60 ? '🏆' : '📚'}`}>
            {resultado.puntaje >= 60 ? '🏆' : '📚'}
          </div>
          <h1 className="text-2xl font-bold text-brand-dark mb-2">
            {resultado.puntaje >= 60 ? '¡Aprobado!' : 'Sigue practicando'}
          </h1>
          <p className="text-4xl font-bold text-accent my-4">{resultado.puntaje}%</p>
          <p className="text-neutral-text">{resultado.correctas} de {resultado.total} respuestas correctas</p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(`/cursos/${idCurso}`)}
            className="mt-8"
          >
            Volver al curso
          </Button>
        </div>
      </div>
    )
  }

  if (preguntas.length > 0) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <h1 className="text-xl font-bold text-brand-dark mb-6">Quiz</h1>
          <div className="space-y-6">
            {preguntas.map((p, i) => (
              <Card key={p.id}>
                <CardContent>
                  <p className="font-semibold text-brand-dark text-lg mb-4">{i + 1}. {p.enunciado}</p>
                  <div className="space-y-2">
                    {p.opciones.map((op) => (
                      <button
                        key={op.id}
                        onClick={() => handleSeleccionar(p.id, op.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                          respuestas[p.id] === op.id
                            ? 'border-primary bg-primary/10 text-primary font-medium'
                            : 'border-border hover:bg-soft-lavender/20 text-brand-dark'
                        }`}
                      >
                        {op.texto}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-neutral-text">{Object.keys(respuestas).length} de {preguntas.length} respondidas</p>
            <Button
              variant="accent"
              size="lg"
              onClick={handleEnviar}
              disabled={!todasRespondidas || registrando}
            >
              {registrando ? 'Enviando...' : 'Enviar respuestas'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="max-w-lg mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-brand-dark mb-4">Quiz</h1>
        <p className="text-neutral-text mb-8">Se seleccionarán 5 preguntas al azar del banco de preguntas.</p>
        {!progreso?.id_inscripcion && (
          <p className="text-error text-sm mb-4">No estás inscrito en este curso.</p>
        )}
        <Button
          variant="accent"
          size="lg"
          onClick={handleIniciar}
          disabled={iniciando || !progreso?.id_inscripcion}
        >
          {iniciando ? 'Preparando...' : 'Comenzar quiz'}
        </Button>
      </div>
    </div>
  )
}
