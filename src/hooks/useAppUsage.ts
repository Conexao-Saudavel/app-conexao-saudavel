import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { checkUsagePermission, getAppUsageStats, openUsageSettings, AppUsageData, UsageStatsResult } from '../services/AppUsage';

const useAppUsage = () => {
    const [usageData, setUsageData] = useState<UsageStatsResult | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsageStats = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const permissionGranted = await checkUsagePermission();
            if (permissionGranted) {
                const data = await getAppUsageStats();
                setUsageData(data);
            } else {
                setError('Permissão não concedida');
                Alert.alert(
                    'Permissão Necessária',
                    'Você precisa permitir que o app acesse seus dados de uso. Por favor, habilite as permissões nas configurações do app.',
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Abrir Configurações', onPress: openUsageSettings }
                    ]
                );
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMessage);
            console.error('Erro ao buscar estatísticas de uso:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Call fetchUsageStats only once on mount
        fetchUsageStats();
    }, []); // Empty dependency array to run only on mount

    return { 
        usageData, 
        loading, 
        error,
        refetch: fetchUsageStats 
    };
};

export default useAppUsage; 