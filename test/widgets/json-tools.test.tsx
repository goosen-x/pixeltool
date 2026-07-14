import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JSONToolsPage from '@/app/tools/(widgets)/json-tools/page'

/**
 * YAML переехал сюда из удалённого json-yaml-formatter, поэтому проверяем оба
 * направления: JSON → YAML и распознавание YAML на входе.
 */
describe('json-tools: перевод между JSON и YAML', () => {
	it('переводит вставленный JSON в YAML', async () => {
		const user = userEvent.setup()
		render(<JSONToolsPage />)

		const input = screen.getByRole('textbox')
		await user.click(input)
		await user.paste('{"name":"Аня","tags":["a","b"]}')

		const yamlTab = await screen.findByRole('tab', { name: /yaml/i })
		await user.click(yamlTab)

		await waitFor(() => {
			expect(screen.getByText(/name: Аня/)).toBeInTheDocument()
		})
	})

	it('распознаёт YAML на входе и показывает его как JSON', async () => {
		const user = userEvent.setup()
		render(<JSONToolsPage />)

		const input = screen.getByRole('textbox')
		await user.click(input)
		await user.paste('name: Аня\ntags:\n  - a\n  - b\n')

		// Formatted-вкладка активна по умолчанию — там должен лежать JSON.
		await waitFor(() => {
			expect(screen.getByText(/"name": "Аня"/)).toBeInTheDocument()
		})
	})

	it('не считает валидным обычный текст', async () => {
		const user = userEvent.setup()
		render(<JSONToolsPage />)

		const input = screen.getByRole('textbox')
		await user.click(input)
		await user.paste('просто текст, не данные')

		await waitFor(() => {
			expect(screen.queryByRole('tab', { name: /yaml/i })).not.toBeInTheDocument()
		})
	})
})
