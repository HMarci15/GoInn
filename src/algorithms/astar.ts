import { graphData, VertexData, EdgeData } from "../store/graphData";

type NodeId = string;

interface Node {
    id: NodeId;
    f: number; // f = g + h
    g: number; // költség a start-tól
    h: number; // heurisztikus költség a célig
    previous?: NodeId;
    directionFrom?: { dx: number, dy: number };
}

class PriorityQueue {
    private values: Node[] = [];

    enqueue(node: Node) {
        this.values.push(node);
        this.values.sort((a, b) => a.f - b.f);
    }

    dequeue(): Node | undefined {
        return this.values.shift();
    }

    isEmpty() {
        return this.values.length === 0;
    }
}

export function calculateAStarPath(startId: NodeId, endId: NodeId, options?: { avoidTypes?: string[] }) {
    const vertices = graphData.vertices;
    const edges = graphData.edges;

    const openSet = new PriorityQueue();
    const visited: { [id: string]: Node } = {};

    const startNode: Node = {
        id: startId,
        f: 0,
        g: 0,
        h: heuristic(startId, endId),
    };
    openSet.enqueue(startNode);

    while (!openSet.isEmpty()) {
        const current = openSet.dequeue();
        if (!current) break;

        if (current.id === endId) {
            return reconstructPath(current);
        }

        visited[current.id] = current;

        const neighbors = getNeighbors(current.id, edges);
        for (const edge of neighbors) {
            const neighborId = edge.to;
            if (visited[neighborId]) continue;

            const fromV = getVertex(current.id);
            const toV = getVertex(neighborId);
            if (!fromV || !toV) continue;

            // típusok kihagyása
            if (options?.avoidTypes?.includes(toV.type ?? "")) continue;

            const dx = toV.cx - fromV.cx;
            const dy = toV.cy - fromV.cy;

            let directionChangePenalty = 0;
            if (current.directionFrom) {
                const { dx: prevDx, dy: prevDy } = current.directionFrom;
                const sameDirection = (Math.sign(dx) === Math.sign(prevDx)) && (Math.sign(dy) === Math.sign(prevDy));
                if (!sameDirection) {
                    directionChangePenalty = 0; // büntetés kanyarra 
                }
            }

            const distance = calculateDistance(fromV, toV);
            const penalty = toV.penalty ?? 0;
            const tentativeG = current.g + distance + penalty + directionChangePenalty;


            const existing = openSet['values'].find(n => n.id === neighborId);
            if (!existing || tentativeG < existing.g) {
                const h = heuristic(neighborId, endId);
                const node: Node = {
                    id: neighborId,
                    g: tentativeG,
                    h,
                    f: tentativeG + h,
                    previous: current.id,
                    directionFrom: { dx, dy },
                };
                openSet.enqueue(node);
            }
        }
    }

    return [];

    function reconstructPath(endNode: Node): string[] {
        const path = [endNode.id];
        let current = endNode;
        while (current.previous) {
            path.push(current.previous);
            current = visited[current.previous];
        }
        return path.reverse();
    }

    function heuristic(fromId: string, toId: string): number {
        const from = getVertex(fromId);
        const to = getVertex(toId);
        if (!from || !to) return Infinity;
        return calculateDistance(from, to);
    }

    function getVertex(id: string): VertexData | undefined {
        return vertices.find(v => v.id === id);
    }

    function getNeighbors(id: string, edges: EdgeData[]) {
        return edges.filter(e => e.from === id || e.to === id).map(e => {
            return {
                from: id,
                to: e.from === id ? e.to : e.from,
            };
        });
    }

}

function calculateDistance(a: VertexData, b: VertexData) {
    const dx = a.cx - b.cx;
    const dy = a.cy - b.cy;
    return Math.sqrt(dx * dx + dy * dy);
}
