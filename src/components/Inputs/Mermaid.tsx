// components/Inputs/Mermaid.tsx
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Inicializar mermaid una sola vez al cargar el módulo
mermaid.initialize({
	startOnLoad: false,
	theme: 'base',
	securityLevel: 'loose',
	flowchart: {
		useMaxWidth: false, // Desactivar ajuste automático
		htmlLabels: true,
		padding: 20,
		nodeSpacing: 40,
		rankSpacing: 40,
		curve: 'basis',
	},
	themeVariables: {
		primaryColor: '#353434',
		primaryTextColor: '#ffffff',
		primaryBorderColor: '#8d8c8c90',
		
		secondaryColor: '#303233',
		secondaryTextColor: '#ffffff',
		secondaryBorderColor: '#303233',
		
		lineColor: '#ffffff',
		
		background: 'transparent',
		
		textColor: '#ffffff',
		fontSize: '16px',
		fontFamily: 'inherit',
		
		nodeBorder: '#8d8c8c90',
		nodeTextColor: '#ffffff',
	},
});

//let diagramCounter = 0;

interface MermaidDiagramProps {
	chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [error, setError] = useState<string | null>(null);
	//const elementId = useRef(`mermaid-${Date.now()}-${diagramCounter++}`);

	useEffect(() => {
    const renderDiagram = async () => {
        if (!containerRef.current) return;
        
        try {
            setError(null);
            // Generar un ID único real para evitar colisiones
            const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
            
            // Limpiar contenido previo
            containerRef.current.innerHTML = '';

            const { svg } = await mermaid.render(id, chart);
            
            if (containerRef.current) {
                containerRef.current.innerHTML = svg;
                // Ajuste post-render: eliminar alturas fijas que pone Mermaid
                const svgElement = containerRef.current.querySelector('svg');
                if (svgElement) {
                    svgElement.style.maxWidth = '100%';
                    svgElement.style.height = 'auto';
                }
            }
        } catch (err) {
            console.error(err);
            setError('Error al renderizar');
        }
    };

    renderDiagram();
}, [chart]);

	if (error) {
		return (
			<div className="mermaid-diagram mermaid-error">
				<p style={{ color: '#ef4444' }}>{error}</p>
			</div>
		);
	}

	return <div ref={containerRef} className="mermaid-diagram" />;
}