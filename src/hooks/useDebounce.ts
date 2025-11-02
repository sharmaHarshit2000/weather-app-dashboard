import { useState, useEffect } from 'react'


export default function useDebounce<T>(value: T, delay = 300) {
const [deb, setDeb] = useState(value)
useEffect(() => {
const id = setTimeout(() => setDeb(value), delay)
return () => clearTimeout(id)
}, [value, delay])
return deb
}