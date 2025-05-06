import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, Form, FormError, Header } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { isAxiosError } from 'axios'

const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'Apenas letras e hifens são permitidos',
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras' }),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      if (router.query.username) {
        setValue('username', String(router.query.username))
      }
    }
  }, [router.query.username, setValue])

  async function handleRegister({ username, name }: RegisterFormData) {
    try {
      await api.post('/users', { username, name })
      await router.push('/register/conect-calendar')
    } catch (error) {
      if (isAxiosError(error) && error?.response?.data?.message) {
        alert(error.response.data.message)
      }

      console.log(error)
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>
        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text>Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuário"
            {...register('username')}
          />
          {errors.username && <FormError>{errors.username.message}</FormError>}
        </label>
        <label>
          <Text>Nome Completo</Text>
          <TextInput placeholder="Seu nome" {...register('name')} />
          {errors.name && <FormError>{errors.name.message}</FormError>}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
