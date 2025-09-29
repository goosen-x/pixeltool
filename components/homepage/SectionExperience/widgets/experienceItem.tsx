import { OptimizedImage } from '@/components/ui/optimized-image'
import Link from 'next/link'
import { TbWorld } from 'react-icons/tb'
import { FaLocationDot } from 'react-icons/fa6'

import { ExperienceData } from '../SectionExperience'

type Props = {
	itemData: ExperienceData
}

export const ExperienceItem = ({ itemData }: Props) => {
	const { company, job, city, companyUrl, description, images } = itemData

	return (
		<div
			className='grid grin-cols-1 md:grid-cols-2 gap-2 mb-4 p-4'
			key={itemData.title}
		>
			<div>
				<p className='text-foreground text-4xl font-bold'>{company}</p>
				<p className='text-xl mb-4'>{job}</p>
			</div>
			<div className='flex flex-col gap-4'>
				<p className='flex gap-2  text-foreground'>
					<FaLocationDot className='text-foreground text-2xl' /> {city}
				</p>
				{companyUrl && (
					<Link
						className='flex gap-2 text-foreground'
						href={companyUrl}
						target='_blank'
					>
						<TbWorld className='text-foreground text-2xl' /> {companyUrl}
					</Link>
				)}
			</div>
			<p className='text-foreground md:col-span-2 mb-4 text-sm md:text-base'>
				{description}
			</p>
			{images.length > 0 &&
				images.map((src, idx) => (
					<OptimizedImage
						className='rounded-lg object-cover  h-52 w-full '
						src={src}
						alt='hero template'
						width={500}
						height={500}
						key={idx}
					/>
				))}
		</div>
	)
}
