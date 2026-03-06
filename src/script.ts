interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
}

let particles: Particle[] = [];

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
    interface Project {
        id: number;
        title: string;
        description: string;
        image: string;
        tech: string[];
        category: 'webapp' | 'landing';
        link: string;
        fullDesc: string;
    }


}


    const projectsData: Project[] = [... ];

    const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement | null;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        // ...
    }