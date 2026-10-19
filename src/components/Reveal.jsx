import { useInView } from '../hooks/useInView'

/**
 * Wraps a block in the page's standard entrance transition. The element itself
 * carries `.rv`, so no extra markup is introduced.
 *
 * `delay` staggers siblings. `replay` re-arms the reveal once the block has
 * fully dropped below the viewport again, so scrolling back down re-plays it.
 */
export default function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  replay = true,
  style,
  children,
  ...rest
}) {
  const [ref, inView] = useInView({ replay })

  return (
    <Tag
      ref={ref}
      className={`rv${inView ? ' is-on' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--rv-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
