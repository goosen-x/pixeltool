import { BiLogoJavascript, BiLogoTypescript } from 'react-icons/bi'
import { ProjectDataType } from './types'
import {
	FaCss3Alt,
	FaHtml5,
	FaNodeJs,
	FaSass,
	FaShieldAlt
} from 'react-icons/fa'
import {
	SiExpress,
	SiNextdotjs,
	SiStrapi,
	SiPrisma,
	SiTailwindcss
} from 'react-icons/si'
import { TbAlpha } from 'react-icons/tb'
import { GrGraphQl } from 'react-icons/gr'
import { BsFilterCircleFill } from 'react-icons/bs'
import { IoLogoVercel } from 'react-icons/io5'

export const ProjectsData: ProjectDataType[] = [
	{
		name: 'mba',
		title: 'Moscow Business Academy',
		image: '/images/mba-experience-3.png',
		link: 'https://moscow.mba/',
		techs: [
			{
				name: 'Typescript',
				icon: <BiLogoTypescript />
			},
			{
				name: 'Next.js',
				icon: <SiNextdotjs />
			},
			{
				name: 'GraphQL',
				icon: <GrGraphQl />
			},
			{
				name: 'SASS',
				icon: <FaSass />
			},
			{
				name: 'Node.js',
				icon: <FaNodeJs />
			},
			{
				name: 'Strapi',
				icon: <SiStrapi />
			}
		]
	},
	{
		name: 'komponenta',
		title: 'Komponenta',
		image: '/images/komponenta.png',
		link: 'https://ub-komponenta.ru/',
		techs: [
			{
				name: 'Javascript',
				icon: <BiLogoJavascript />
			},
			{
				name: 'HTML',
				icon: <FaHtml5 />
			},
			{
				name: 'CSS',
				icon: <FaCss3Alt />
			},
			{
				name: 'Express.js',
				icon: <SiExpress />
			},
			{
				name: 'AMO CRM',
				icon: <TbAlpha />
			}
		]
	},
	{
		name: 'digitalDyatel',
		title: 'Digital Dyatel',
		image: '/images/digital-dyatel.png',
		link: 'https://digitaldyatel.ru',
		// github: '/',
		techs: [
			{
				name: 'Typescript',
				icon: <BiLogoTypescript />
			},
			{
				name: 'Next.js',
				icon: <SiNextdotjs />
			},
			{
				name: 'Chadcn ui',
				icon: <BsFilterCircleFill className='-rotate-45' />
			}
		]
	},
	{
		name: 'healthshop',
		title: 'HealthShop',
		image: '/images/natures.png',
		link: 'https://www.nsp-healthshop.ru/',
		github: '',
		techs: [
			{
				name: 'Typescript',
				icon: <BiLogoTypescript />
			},
			{
				name: 'Next.js',
				icon: <SiNextdotjs />
			},
			{
				name: 'Chadcn ui',
				icon: <BsFilterCircleFill className='-rotate-45' />
			},
			{
				name: 'Vercel',
				icon: <IoLogoVercel />
			},
			{
				name: 'Tailwind CSS',
				icon: <SiTailwindcss />
			}
		]
	}
]
