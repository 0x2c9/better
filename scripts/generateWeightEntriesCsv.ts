import fs from 'node:fs'
import dayjs from 'dayjs'

const USER_ID = process.env.USER_ID

function generateWeightEntriesForTwoMonths() {
	const result = []
	const startWeight = 130.5
	const endWeight = 99.3
	const days = 90
	const decrement = (startWeight - endWeight) / days

	for (let i = days - 1; i >= 0; i--) {
		const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
		const weight = (startWeight - (days - 1 - i) * decrement + Math.random() * 2 - 1).toFixed(1)
		const user_date_id = `${USER_ID}_${date}`
		result.push({
			weight,
			date,
			user_id: USER_ID,
			user_date_id,
		})
	}

	return result
}

const weightEntries = generateWeightEntriesForTwoMonths()

// Generate CSV
const header = ['weight', 'date', 'user_id', 'user_date_id']
const csv = [
	header.join(','),
	...weightEntries.map((row) => Object.values(row).join(',')),
].join('\n')

// Write CSV to file
fs.writeFileSync('./scripts/weightEntries.csv', csv)
