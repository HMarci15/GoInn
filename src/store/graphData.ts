export interface VertexData {
    id: string;
    objectName: string | null;
    cx: number;
    cy: number;
    floor: number;
    type?: "corridor" | "lift" | "stairs" | "toilet" | "entry" | "emexit" | "room" | "public";
    penalty?: number;
}

export interface EdgeData {
    id: string;
    from: string;
    to: string;
}

export interface GraphData {
    vertices: VertexData[];
    edges: EdgeData[];
}



export const graphData: GraphData = {
    vertices: [
        //folyoso_0
        { id: "nodefoly_107wellnes", objectName: null, cx: 33.1, cy: 61.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_108", objectName: null, cx: 64.4, cy: 61.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_109", objectName: null, cx: 98.1, cy: 61.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_liftpih1", objectName: null, cx: 120.2, cy: 61.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_lift1_f0", objectName: null, cx: 124.0, cy: 61.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_lepcso_f0", objectName: null, cx: 149.1, cy: 61.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_lift2_f0", objectName: null, cx: 173.6, cy: 61.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_liftpih2", objectName: null, cx: 177.0, cy: 61.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_110", objectName: null, cx: 199.2, cy: 61.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_111", objectName: null, cx: 232.0, cy: 61.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_noiwc_f0", objectName: null, cx: 245.0, cy: 61.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_112", objectName: null, cx: 263.6, cy: 61.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_ferfiwc_f0", objectName: null, cx: 273.5, cy: 61.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_piheno1", objectName: null, cx: 120.2, cy: 86.8, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_piheno2", objectName: null, cx: 177.0, cy: 86.8, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_etterem", objectName: null, cx: 120.2, cy: 103.8, floor: 0, type: "corridor", penalty: 40 },
        { id: "nodefoly_kozep", objectName: null, cx: 149.1, cy: 103.8, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_bar", objectName: null, cx: 177.0, cy: 103.8, floor: 0, type: "corridor", penalty: 40 },
        { id: "nodefoly_piheno3", objectName: null, cx: 120.2, cy: 120.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_piheno4", objectName: null, cx: 177.0, cy: 120.3, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_101vesz", objectName: null, cx: 33.7, cy: 146.6, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_102", objectName: null, cx: 65.4, cy: 146.6, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_103", objectName: null, cx: 96.4, cy: 146.6, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_recpih3", objectName: null, cx: 120.2, cy: 146.6, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_bej101106", objectName: null, cx: 149.1, cy: 146.6, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_szerpih4", objectName: null, cx: 177.0, cy: 146.6, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_104", objectName: null, cx: 202.1, cy: 146.6, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_105", objectName: null, cx: 233.1, cy: 146.6, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_konft", objectName: null, cx: 250.1, cy: 146.6, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_106vesz", objectName: null, cx: 263.2, cy: 146.6, floor: 0, type: "corridor", penalty: 0 },
        { id: "nodefoly_bejrecszer", objectName: null, cx: 149.1, cy: 177.3, floor: 0, type: "corridor", penalty: 0 },
        //helyisegek_0
        { id: "node_wellnes", objectName: "Wellnes", cx: 19.3, cy: 61.3, floor: 0, type: "public", penalty: 0 },
        { id: "node_107", objectName: "Szoba 107", cx: 33.1, cy: 47.7, floor: 0, type: "room", penalty: 0 },
        { id: "node_108", objectName: "Szoba 108", cx: 64.4, cy: 47.7, floor: 0, type: "room", penalty: 0 },
        { id: "node_109", objectName: "Szoba 109", cx: 98.1, cy: 47.7, floor: 0, type: "room", penalty: 0 },
        { id: "node_lift1_f0", objectName: "Lift", cx: 124.0, cy: 47.7, floor: 0, type: "lift", penalty: 0 },
        { id: "node_lepcso_f0", objectName: "Lépcső", cx: 149.1, cy: 47.7, floor: 0, type: "stairs", penalty: 0 },
        { id: "node_lift2_f0", objectName: "Lift", cx: 173.6, cy: 47.7, floor: 0, type: "lift", penalty: 0 },
        { id: "node_110", objectName: "Szoba 110", cx: 199.2, cy: 47.7, floor: 0, type: "room", penalty: 0 },
        { id: "node_111", objectName: "Szoba 111", cx: 232.0, cy: 47.7, floor: 0, type: "room", penalty: 0 },
        { id: "node_noiwc_f0", objectName: "Női mosdó", cx: 245.0, cy: 75.3, floor: 0, type: "toilet", penalty: 0 },
        { id: "node_112", objectName: "Szoba 112", cx: 263.6, cy: 47.7, floor: 0, type: "room", penalty: 0 },
        { id: "node_ferfiwc_f0", objectName: "Férfi mosdó", cx: 273.5, cy: 75.3, floor: 0, type: "toilet", penalty: 0 },
        { id: "node_piheno1", objectName: "Pihenő", cx: 116.5, cy: 86.8, floor: 0, type: "public", penalty: 0 },
        { id: "node_piheno2", objectName: "Pihenő", cx: 181.2, cy: 86.8, floor: 0, type: "public", penalty: 0 },
        { id: "node_etterem", objectName: "Étterem", cx: 102.5, cy: 103.8, floor: 0, type: "public", penalty: 0 },
        { id: "node_bar", objectName: "Bár", cx: 195.6, cy: 103.8, floor: 0, type: "public", penalty: 0 },
        { id: "node_piheno3", objectName: "Pihenő", cx: 116.7, cy: 120.3, floor: 0, type: "public", penalty: 0 },
        { id: "node_piheno4", objectName: "Pihenő", cx: 181.1, cy: 120.3, floor: 0, type: "public", penalty: 0 },
        { id: "node_vesz1", objectName: "Vészkijárat", cx: 19.3, cy: 146.6, floor: 0, type: "emexit", penalty: 0 },
        { id: "node_101", objectName: "Szoba 101", cx: 33.7, cy: 160.0, floor: 0, type: "room", penalty: 0 },
        { id: "node_102", objectName: "Szoba 102", cx: 65.4, cy: 160.0, floor: 0, type: "room", penalty: 0 },
        { id: "node_103", objectName: "Szoba 103", cx: 96.4, cy: 160.0, floor: 0, type: "room", penalty: 0 },
        { id: "node_recepcio", objectName: "Recepció", cx: 132.6, cy: 177.3, floor: 0, type: "public", penalty: 0 },
        { id: "node_bejarat", objectName: "Bejárat", cx: 149.1, cy: 198.4, floor: 0, type: "entry", penalty: 0 },
        { id: "node_szertar", objectName: "Szertár", cx: 165.5, cy: 177.3, floor: 0, type: "public", penalty: 0 },
        { id: "node_104", objectName: "Szoba 104", cx: 202.1, cy: 160.0, floor: 0, type: "room", penalty: 0 },
        { id: "node_105", objectName: "Szoba 105", cx: 233.1, cy: 160.0, floor: 0, type: "room", penalty: 0 },
        { id: "node_konfterem", objectName: "Konferenciaterem", cx: 250.1, cy: 132.3, floor: 0, type: "public", penalty: 0 },
        { id: "node_106", objectName: "Szoba 106", cx: 263.2, cy: 160.0, floor: 0, type: "room", penalty: 0 },
        { id: "node_vesz2", objectName: "Vészkijárat", cx: 278.8, cy: 146.6, floor: 0, type: "emexit", penalty: 0 },
        //folyoso_1
        { id: "nodefoly_202", objectName: null, cx: 59.5, cy: 61.3, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_202201", objectName: null, cx: 74.8, cy: 61.3, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_201", objectName: null, cx: 92.1, cy: 61.3, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_lift1_f1", objectName: null, cx: 124.0, cy: 61.3, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_lepcso_f1", objectName: null, cx: 148.1, cy: 61.3, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_lift2_f1", objectName: null, cx: 174.0, cy: 61.3, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_210", objectName: null, cx: 205.7, cy: 61.3, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_210209", objectName: null, cx: 223.2, cy: 61.3, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_209", objectName: null, cx: 238.0, cy: 61.3, floor: 1, type: "corridor", penalty: 0 },
        //{ id: "nodefoly_203", objectName: null, cx: 74.8, cy: 70.6, floor: 1, type: "corridor", penalty: 0 },
        //{ id: "nodefoly_208", objectName: null, cx: 223.2, cy: 70.6, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_204", objectName: null, cx: 74.8, cy: 116.4, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_207", objectName: null, cx: 223.2, cy: 116.4, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_jatszoszoba", objectName: null, cx: 74.8, cy: 146.4, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_205", objectName: null, cx: 91.0, cy: 146.4, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_noiwc_f1", objectName: null, cx: 123.0, cy: 146.4, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_ferfiwc_f1", objectName: null, cx: 175.6, cy: 146.4, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_206", objectName: null, cx: 207.8, cy: 146.4, floor: 1, type: "corridor", penalty: 0 },
        { id: "nodefoly_konyvsarok", objectName: null, cx: 223.2, cy: 146.4, floor: 1, type: "corridor", penalty: 0 },
        //helyisegek_1
        { id: "node_202", objectName: "Szoba 202", cx: 59.5, cy: 47.4, floor: 1, type: "room", penalty: 0 },
        { id: "node_201", objectName: "Szoba 201", cx: 92.1, cy: 47.4, floor: 1, type: "room", penalty: 0 },
        { id: "node_lift1_f1", objectName: "Lift", cx: 124.0, cy: 47.4, floor: 1, type: "lift", penalty: 0 },
        { id: "node_lepcso_f1", objectName: "Lépcső", cx: 148.1, cy: 47.4, floor: 1, type: "stairs", penalty: 0 },
        { id: "node_lift2_f1", objectName: "Lift", cx: 174.0, cy: 47.4, floor: 1, type: "lift", penalty: 0 },
        { id: "node_210", objectName: "Szoba 210", cx: 205.7, cy: 47.4, floor: 1, type: "room", penalty: 0 },
        { id: "node_209", objectName: "Szoba 209", cx: 238.0, cy: 47.4, floor: 1, type: "room", penalty: 0 },
        { id: "node_203", objectName: "Szoba 203", cx: 50.5, cy: 61.3, floor: 1, type: "room", penalty: 0 },
        { id: "node_208", objectName: "Szoba 208", cx: 246.8, cy: 61.3, floor: 1, type: "room", penalty: 0 },
        { id: "node_mozi", objectName: "Moziterem", cx: 148.1, cy: 75.7, floor: 1, type: "public", penalty: 0 },
        { id: "node_204", objectName: "Szoba 204", cx: 50.5, cy: 116.4, floor: 1, type: "room", penalty: 0 },
        { id: "node_207", objectName: "Szoba 207", cx: 246.8, cy: 116.4, floor: 1, type: "room", penalty: 0 },
        { id: "node_jatszoszoba", objectName: "Játszószoba", cx: 56.8, cy: 146.4, floor: 1, type: "public", penalty: 0 },
        { id: "node_205", objectName: "Szoba 205", cx: 91.0, cy: 160.4, floor: 1, type: "room", penalty: 0 },
        { id: "node_noiwc_f1", objectName: "Női mosdó", cx: 123.0, cy: 160.4, floor: 1, type: "toilet", penalty: 0 },
        { id: "node_ferfiwc_f1", objectName: "Férfi mosdó", cx: 175.6, cy: 160.4, floor: 1, type: "toilet", penalty: 0 },
        { id: "node_206", objectName: "Szoba 206", cx: 207.8, cy: 160.4, floor: 1, type: "room", penalty: 0 },
        { id: "node_konyvsarok", objectName: "Könyvsarok", cx: 241.1, cy: 146.4, floor: 1, type: "public", penalty: 0 },
        //folyoso_2
        { id: "nodefoly_terasz301", objectName: null, cx: 79.2, cy: 58.3, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_301lift1", objectName: null, cx: 95.0, cy: 58.3, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_lift1_f2", objectName: null, cx: 123.9, cy: 58.3, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_lepcso_f2", objectName: null, cx: 149.0, cy: 58.3, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_lift2_f2", objectName: null, cx: 173.7, cy: 58.3, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_lift2306", objectName: null, cx: 203.4, cy: 58.3, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_306terasz", objectName: null, cx: 218.8, cy: 58.3, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_302", objectName: null, cx: 95.0, cy: 103.7, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_305", objectName: null, cx: 203.4, cy: 103.7, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_terasz303", objectName: null, cx: 78.4, cy: 149.7, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_303noiwc", objectName: null, cx: 95.0, cy: 149.7, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_noiwc_f2", objectName: null, cx: 123.1, cy: 149.7, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_ferfiwc_f2", objectName: null, cx: 175.7, cy: 149.7, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_ferfiwc304", objectName: null, cx: 203.4, cy: 149.7, floor: 2, type: "corridor", penalty: 0 },
        { id: "nodefoly_304terasz", objectName: null, cx: 220.3, cy: 149.7, floor: 2, type: "corridor", penalty: 0 },
        //helyisegek_2
        { id: "node_301", objectName: "Szoba 301", cx: 79.2, cy: 47.4, floor: 2, type: "room", penalty: 0 },
        { id: "node_lift1_f2", objectName: "Lift", cx: 123.9, cy: 47.4, floor: 2, type: "lift", penalty: 0 },
        { id: "node_lepcso_f2", objectName: "Lépcső", cx: 149.0, cy: 47.4, floor: 2, type: "stairs", penalty: 0 },
        { id: "node_lift2_f2", objectName: "Lift", cx: 173.7, cy: 47.4, floor: 2, type: "lift", penalty: 0 },
        { id: "node_306", objectName: "Szoba 306", cx: 218.8, cy: 47.4, floor: 2, type: "room", penalty: 0 },
        { id: "node_terasz1", objectName: "Terasz", cx: 42.9, cy: 58.3, floor: 2, type: "public", penalty: 0 },
        { id: "node_terasz2", objectName: "Terasz", cx: 255.1, cy: 58.3, floor: 2, type: "public", penalty: 0 },
        { id: "node_kulturszoba", objectName: "Kultúrszoba", cx: 149.0, cy: 69.2, floor: 2, type: "public", penalty: 0 },
        { id: "node_302", objectName: "Szoba 302", cx: 74.0, cy: 103.7, floor: 2, type: "room", penalty: 0 },
        { id: "node_305", objectName: "Szoba 305", cx: 223.8, cy: 103.7, floor: 2, type: "room", penalty: 0 },
        { id: "node_terasz3", objectName: "Terasz", cx: 42.9, cy: 149.7, floor: 2, type: "public", penalty: 0 },
        { id: "node_terasz4", objectName: "Terasz", cx: 255.1, cy: 149.7, floor: 2, type: "public", penalty: 0 },
        { id: "node_303", objectName: "Szoba 303", cx: 78.4, cy: 160.3, floor: 2, type: "room", penalty: 0 },
        { id: "node_noiwc_f2", objectName: "Női mosdó", cx: 123.1, cy: 160.3, floor: 2, type: "toilet", penalty: 0 },
        { id: "node_ferfiwc_f2", objectName: "Férfi mosdó", cx: 175.7, cy: 160.3, floor: 2, type: "toilet", penalty: 0 },
        { id: "node_304", objectName: "Szoba 304", cx: 220.3, cy: 160.3, floor: 2, type: "room", penalty: 0 },


    ],
    edges: [
        //foldszint
        { id: "node_wellnes_to_nodefoly_107wellnes", from: "node_wellnes", to: "nodefoly_107wellnes" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "node_107_to_nodefoly_107wellnes", from: "node_107", to: "nodefoly_107wellnes" },
        //{ id: "nodefoly_107wellnes_to_node_107", from: "nodefoly_107wellnes", to: "node_107" },

        { id: "nodefoly_108_to_nodefoly_107wellnes", from: "nodefoly_108", to: "nodefoly_107wellnes" },
        //{ id: "nodefoly_107wellnes_to_nodefoly_108", from: "nodefoly_107wellnes", to: "nodefoly_108" },

        { id: "nodefoly_108_to_node_108", from: "nodefoly_108", to: "node_108" },
        //{ id: "node_108_to_nodefoly_108", from: "node_108", to: "nodefoly_108" },

        { id: "nodefoly_108_to_nodefoly_109", from: "nodefoly_108", to: "nodefoly_109" },
        //{ id: "nodefoly_109_to_nodefoly_108", from: "nodefoly_109", to: "nodefoly_108" },

        { id: "nodefoly_109_to_node_109", from: "nodefoly_109", to: "node_109" },
        //{ id: "node_109_to_nodefoly_109", from: "node_109", to: "nodefoly_109" },

        { id: "nodefoly_109_to_nodefoly_liftpih1", from: "nodefoly_109", to: "nodefoly_liftpih1" },
        //{ id: "nodefoly_liftpih1_to_nodefoly_109", from: "nodefoly_liftpih1", to: "nodefoly_109" },

        { id: "nodefoly_liftpih1_to_nodefoly_lift1_f0", from: "nodefoly_liftpih1", to: "nodefoly_lift1_f0" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_liftpih1_to_nodefoly_piheno1", from: "nodefoly_liftpih1", to: "nodefoly_piheno1" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_lift1_f0_to_node_lift1_f0", from: "nodefoly_lift1_f0", to: "node_lift1_f0" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_lift1_f0_to_nodefoly_lepcso_f0", from: "nodefoly_lift1_f0", to: "nodefoly_lepcso_f0" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_lepcso_f0_to_node_lepcso_f0", from: "nodefoly_lepcso_f0", to: "node_lepcso_f0" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_lepcso_f0_to_nodefoly_lift2_f0", from: "nodefoly_lepcso_f0", to: "nodefoly_lift2_f0" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_lepcso_f0_to_nodefoly_kozep", from: "nodefoly_lepcso_f0", to: "nodefoly_kozep" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_lift2_f0_to_nodefoly_liftpih2", from: "nodefoly_lift2_f0", to: "nodefoly_liftpih2" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_lift2_f0_to_node_lift2_f0", from: "nodefoly_lift2_f0", to: "node_lift2_f0" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_liftpih2_to_nodefoly_110", from: "nodefoly_liftpih2", to: "nodefoly_110" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_liftpih2_to_nodefoly_piheno2", from: "nodefoly_liftpih2", to: "nodefoly_piheno2" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_110_to_node_110", from: "nodefoly_110", to: "node_110" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_110_to_nodefoly_111", from: "nodefoly_110", to: "nodefoly_111" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_111_to_node_111", from: "nodefoly_111", to: "node_111" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_111_to_nodefoly_noiwc_f0", from: "nodefoly_111", to: "nodefoly_noiwc_f0" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_noiwc_f0_to_node_noiwc_f0", from: "nodefoly_noiwc_f0", to: "node_noiwc_f0" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_noiwc_f0_to_nodefoly_112", from: "nodefoly_noiwc_f0", to: "nodefoly_112" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_112_to_node_112", from: "nodefoly_112", to: "node_112" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_112_to_nodefoly_ferfiwc_f0", from: "nodefoly_112", to: "nodefoly_ferfiwc_f0" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_ferfiwc_f0_to_node_ferfiwc_f0", from: "nodefoly_ferfiwc_f0", to: "node_ferfiwc_f0" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_ferfiwc_f0_to_node_ferfiwc_f0", from: "nodefoly_ferfiwc_f0", to: "node_ferfiwc_f0" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_ferfiwc_f0_to_node_ferfiwc_f0", from: "nodefoly_ferfiwc_f0", to: "node_ferfiwc_f0" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_piheno1_to_node_piheno1", from: "nodefoly_piheno1", to: "node_piheno1" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_piheno1_to_nodefoly_etterem", from: "nodefoly_piheno1", to: "nodefoly_etterem" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_piheno2_to_node_piheno2", from: "nodefoly_piheno2", to: "node_piheno2" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_piheno2_to_nodefoly_bar", from: "nodefoly_piheno2", to: "nodefoly_bar" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_etterem_to_node_etterem", from: "nodefoly_etterem", to: "node_etterem" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_etterem_to_nodefoly_kozep", from: "nodefoly_etterem", to: "nodefoly_kozep" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_bar_to_nodefoly_kozep", from: "nodefoly_bar", to: "nodefoly_kozep" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_bar_to_node_bar", from: "nodefoly_bar", to: "node_bar" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_etterem_to_nodefoly_piheno3", from: "nodefoly_etterem", to: "nodefoly_piheno3" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_piheno3_to_node_piheno3", from: "nodefoly_piheno3", to: "node_piheno3" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_bar_to_nodefoly_piheno4", from: "nodefoly_bar", to: "nodefoly_piheno4" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_piheno4_to_node_piheno4", from: "nodefoly_piheno4", to: "node_piheno4" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "node_vesz1_to_nodefoly_101vesz", from: "node_vesz1", to: "nodefoly_101vesz" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_101vesz_to_node_101", from: "nodefoly_101vesz", to: "node_101" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_101vesz_to_nodefoly_102", from: "nodefoly_101vesz", to: "nodefoly_102" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_102_to_node_102", from: "nodefoly_102", to: "node_102" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_102_to_nodefoly_103", from: "nodefoly_102", to: "nodefoly_103" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_103_to_node_103", from: "nodefoly_103", to: "node_103" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_103_to_nodefoly_recpih3", from: "nodefoly_103", to: "nodefoly_recpih3" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_recpih3_to_nodefoly_piheno3", from: "nodefoly_recpih3", to: "nodefoly_piheno3" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_recpih3_to_nodefoly_bej101106", from: "nodefoly_recpih3", to: "nodefoly_bej101106" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_bej101106_to_nodefoly_kozep", from: "nodefoly_bej101106", to: "nodefoly_kozep" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_bej101106_to_nodefoly_bejrecszer", from: "nodefoly_bej101106", to: "nodefoly_bejrecszer" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_bej101106_to_nodefoly_szerpih4", from: "nodefoly_bej101106", to: "nodefoly_szerpih4" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_szerpih4_to_nodefoly_piheno4", from: "nodefoly_szerpih4", to: "nodefoly_piheno4" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_szerpih4_to_nodefoly_104", from: "nodefoly_szerpih4", to: "nodefoly_104" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_104_to_node_104", from: "nodefoly_104", to: "node_104" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_104_to_nodefoly_105", from: "nodefoly_104", to: "nodefoly_105" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_105_to_node_105", from: "nodefoly_105", to: "node_105" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_105_to_nodefoly_konft", from: "nodefoly_105", to: "nodefoly_konft" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_konft_to_node_konfterem", from: "nodefoly_konft", to: "node_konfterem" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_konft_to_nodefoly_106vesz", from: "nodefoly_konft", to: "nodefoly_106vesz" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_106vesz_to_node_106", from: "nodefoly_106vesz", to: "node_106" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_106vesz_to_node_vesz2", from: "nodefoly_106vesz", to: "node_vesz2" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_bejrecszer_to_node_recepcio", from: "nodefoly_bejrecszer", to: "node_recepcio" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_bejrecszer_to_node_szertar", from: "nodefoly_bejrecszer", to: "node_szertar" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        { id: "nodefoly_bejrecszer_to_node_bejarat", from: "nodefoly_bejrecszer", to: "node_bejarat" },
        //{ id: "nodefoly_107wellnes_to_node_wellnes", from: "nodefoly_107wellnes", to: "node_wellnes" },

        //földszint-1.emelet
        { id: "node_lift1_f0_to_node_lift1_f1", from: "node_lift1_f0", to: "node_lift1_f1" },

        { id: "node_lepcso_f0_to_node_lepcso_f1", from: "node_lepcso_f0", to: "node_lepcso_f1" },

        { id: "node_lift2_f0_to_node_lift2_f1", from: "node_lift2_f0", to: "node_lift2_f1" },

        //1.emelet
        { id: "node_202_to_nodefoly_202", from: "node_202", to: "nodefoly_202" },

        { id: "node_203_to_nodefoly_202", from: "node_203", to: "nodefoly_202" },

        { id: "nodefoly_202_to_nodefoly_202201", from: "nodefoly_202", to: "nodefoly_202201" },

        { id: "nodefoly_202201_to_nodefoly_201", from: "nodefoly_202201", to: "nodefoly_201" },

        { id: "node_201_to_nodefoly_201", from: "node_201", to: "nodefoly_201" },

        { id: "nodefoly_201_to_nodefoly_lift1_f1", from: "nodefoly_201", to: "nodefoly_lift1_f1" },

        { id: "node_lift1_f1_to_nodefoly_lift1_f1", from: "node_lift1_f1", to: "nodefoly_lift1_f1" },

        { id: "nodefoly_lift1_f1_to_nodefoly_lepcso_f1", from: "nodefoly_lift1_f1", to: "nodefoly_lepcso_f1" },

        { id: "node_lepcso_f1_to_nodefoly_lepcso_f1", from: "node_lepcso_f1", to: "nodefoly_lepcso_f1" },

        { id: "node_mozi_to_nodefoly_lepcso_f1", from: "node_mozi", to: "nodefoly_lepcso_f1" },

        { id: "nodefoly_lepcso_f1_to_nodefoly_lift2_f1", from: "nodefoly_lepcso_f1", to: "nodefoly_lift2_f1" },

        { id: "node_lift2_f1_to_nodefoly_lift2_f1", from: "node_lift2_f1", to: "nodefoly_lift2_f1" },

        { id: "nodefoly_lift2_f1_to_nodefoly_210", from: "nodefoly_lift2_f1", to: "nodefoly_210" },

        { id: "node_210_to_nodefoly_210", from: "node_210", to: "nodefoly_210" },

        { id: "nodefoly_210_to_nodefoly_210209", from: "nodefoly_210", to: "nodefoly_210209" },

        { id: "nodefoly_210209_to_nodefoly_209", from: "nodefoly_210209", to: "nodefoly_209" },

        { id: "node_209_to_nodefoly_209", from: "node_209", to: "nodefoly_209" },

        { id: "node_208_to_nodefoly_209", from: "node_208", to: "nodefoly_209" },
        //
        { id: "nodefoly_202201_to_nodefoly_204", from: "nodefoly_202201", to: "nodefoly_204" },

        { id: "nodefoly_210209_to_nodefoly_207", from: "nodefoly_210209", to: "nodefoly_207" },

        { id: "node_204_to_nodefoly_204", from: "node_204", to: "nodefoly_204" },

        { id: "node_207_to_nodefoly_207", from: "node_207", to: "nodefoly_207" },
        //
        { id: "nodefoly_204_to_nodefoly_jatszoszoba", from: "nodefoly_204", to: "nodefoly_jatszoszoba" },

        { id: "nodefoly_207_to_nodefoly_konyvsarok", from: "nodefoly_207", to: "nodefoly_konyvsarok" },

        { id: "node_jatszoszoba_to_nodefoly_jatszoszoba", from: "node_jatszoszoba", to: "nodefoly_jatszoszoba" },

        { id: "nodefoly_jatszoszoba_to_nodefoly_205", from: "nodefoly_jatszoszoba", to: "nodefoly_205" },

        { id: "node_205_to_nodefoly_205", from: "node_205", to: "nodefoly_205" },

        { id: "nodefoly_205_to_nodefoly_noiwc_f1", from: "nodefoly_205", to: "nodefoly_noiwc_f1" },

        { id: "node_noiwc_f1_to_nodefoly_noiwc_f1", from: "node_noiwc_f1", to: "nodefoly_noiwc_f1" },

        { id: "nodefoly_noiwc_f1_to_nodefoly_ferfiwc_f1", from: "nodefoly_noiwc_f1", to: "nodefoly_ferfiwc_f1" },

        { id: "node_ferfiwc_f1_to_nodefoly_ferfiwc_f1", from: "node_ferfiwc_f1", to: "nodefoly_ferfiwc_f1" },

        { id: "nodefoly_ferfiwc_f1_to_nodefoly_206", from: "nodefoly_ferfiwc_f1", to: "nodefoly_206" },

        { id: "node_206_to_nodefoly_206", from: "node_206", to: "nodefoly_206" },

        { id: "nodefoly_206_to_nodefoly_konyvsarok", from: "nodefoly_206", to: "nodefoly_konyvsarok" },

        { id: "node_konyvsarok_to_nodefoly_konyvsarok", from: "node_konyvsarok", to: "nodefoly_konyvsarok" },

        //1.emelet-2.emelet
        { id: "node_lift1_f1_to_node_lift1_f2", from: "node_lift1_f1", to: "node_lift1_f2" },

        { id: "node_lepcso_f1_to_node_lepcso_f2", from: "node_lepcso_f1", to: "node_lepcso_f2" },

        { id: "node_lift2_f1_to_node_lift2_f2", from: "node_lift2_f1", to: "node_lift2_f2" },

        //2.emelet
        { id: "node_terasz1_to_nodefoly_terasz301", from: "node_terasz1", to: "nodefoly_terasz301" },

        { id: "node_301_to_nodefoly_terasz301", from: "node_301", to: "nodefoly_terasz301" },

        { id: "nodefoly_terasz301_to_nodefoly_301lift1", from: "nodefoly_terasz301", to: "nodefoly_301lift1" },

        { id: "nodefoly_301lift1_to_nodefoly_lift1_f2", from: "nodefoly_301lift1", to: "nodefoly_lift1_f2" },

        { id: "node_lift1_f2_to_nodefoly_lift1_f2", from: "node_lift1_f2", to: "nodefoly_lift1_f2" },

        { id: "nodefoly_lift1_f2_to_nodefoly_lepcso_f2", from: "nodefoly_lift1_f2", to: "nodefoly_lepcso_f2" },

        { id: "node_lepcso_f2_to_nodefoly_lepcso_f2", from: "node_lepcso_f2", to: "nodefoly_lepcso_f2" },

        { id: "node_kulturszoba_to_nodefoly_lepcso_f2", from: "node_kulturszoba", to: "nodefoly_lepcso_f2" },

        { id: "nodefoly_lepcso_f2_to_nodefoly_lift2_f2", from: "nodefoly_lepcso_f2", to: "nodefoly_lift2_f2" },

        { id: "node_lift2_f2_to_nodefoly_lift2_f2", from: "node_lift2_f2", to: "nodefoly_lift2_f2" },

        { id: "nodefoly_lift2_f2_to_nodefoly_lift2306", from: "nodefoly_lift2_f2", to: "nodefoly_lift2306" },

        { id: "nodefoly_lift2306_to_nodefoly_306terasz", from: "nodefoly_lift2306", to: "nodefoly_306terasz" },

        { id: "node_306_to_nodefoly_306terasz", from: "node_306", to: "nodefoly_306terasz" },

        { id: "nodefoly_306terasz_to_node_terasz2", from: "nodefoly_306terasz", to: "node_terasz2" },

        { id: "nodefoly_301lift1_to_nodefoly_302", from: "nodefoly_301lift1", to: "nodefoly_302" },

        { id: "node_302_to_nodefoly_302", from: "node_302", to: "nodefoly_302" },

        { id: "nodefoly_lift2306_to_nodefoly_305", from: "nodefoly_lift2306", to: "nodefoly_305" },

        { id: "node_305_to_nodefoly_305", from: "node_305", to: "nodefoly_305" },

        { id: "node_terasz3_to_nodefoly_terasz303", from: "node_terasz3", to: "nodefoly_terasz303" },

        { id: "node_303_to_nodefoly_terasz303", from: "node_303", to: "nodefoly_terasz303" },

        { id: "nodefoly_terasz303_to_nodefoly_303noiwc", from: "nodefoly_terasz303", to: "nodefoly_303noiwc" },

        { id: "nodefoly_302_to_nodefoly_303noiwc", from: "nodefoly_302", to: "nodefoly_303noiwc" },

        { id: "nodefoly_303noiwc_to_nodefoly_noiwc_f2", from: "nodefoly_303noiwc", to: "nodefoly_noiwc_f2" },

        { id: "node_noiwc_f2_to_nodefoly_noiwc_f2", from: "node_noiwc_f2", to: "nodefoly_noiwc_f2" },

        { id: "nodefoly_noiwc_f2_to_nodefoly_ferfiwc_f2", from: "nodefoly_noiwc_f2", to: "nodefoly_ferfiwc_f2" },

        { id: "node_ferfiwc_f2_to_nodefoly_ferfiwc_f2", from: "node_ferfiwc_f2", to: "nodefoly_ferfiwc_f2" },

        { id: "nodefoly_ferfiwc_f2_to_nodefoly_ferfiwc304", from: "nodefoly_ferfiwc_f2", to: "nodefoly_ferfiwc304" },

        { id: "nodefoly_305_to_nodefoly_ferfiwc304", from: "nodefoly_305", to: "nodefoly_ferfiwc304" },

        { id: "nodefoly_ferfiwc304_to_nodefoly_304terasz", from: "nodefoly_ferfiwc304", to: "nodefoly_304terasz" },

        { id: "node_304_to_nodefoly_304terasz", from: "node_304", to: "nodefoly_304terasz" },

        { id: "nodefoly_304terasz_to_node_terasz4", from: "nodefoly_304terasz", to: "node_terasz4" },



    ]
};
