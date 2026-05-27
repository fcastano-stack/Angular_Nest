// Importa la función para crear cliente de Supabase
import { createClient } from '@supabase/supabase-js';
// Configuración de Supabase con URL y clave anónima del proyecto
const SUPABASE_URL = 'https://fijfytpfthdkiyqxgngd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Am1xeythFsWmoRejowe40w_DBSQIPS1';
// Cliente de Supabase configurado para evitar problemas con Navigator LockManager
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: {
		persistSession: false,    // No persiste la sesión en localStorage
		autoRefreshToken: false,  // No renueva automáticamente el token
	},
	realtime: {
		params: {
			eventsPerSecond: 2,     // Limita a 2 eventos por segundo para mejor rendimiento
		},
	},
});
