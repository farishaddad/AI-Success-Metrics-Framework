// Migration utility to move data from localStorage to database

import { feedbackAPI, useCaseAPI } from '../services/api';
import { storage, STORAGE_KEYS } from './storage';

/**
 * Migration status
 */
export const MigrationStatus = {
  NOT_NEEDED: 'not_needed',
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

/**
 * Check if migration is needed
 */
export async function checkMigrationNeeded() {
  try {
    // Check if there's data in localStorage
    const localFeedback = storage.getItem(STORAGE_KEYS.USER_FEEDBACK, []);
    const localUseCases = storage.getItem('useCases', []);
    
    // Check if migration has already been completed
    const migrationCompleted = storage.getItem('migrationCompleted', false);
    
    if (migrationCompleted) {
      return {
        status: MigrationStatus.NOT_NEEDED,
        message: 'Migration already completed',
        feedbackCount: 0,
        useCaseCount: 0
      };
    }
    
    const feedbackCount = localFeedback.length;
    const useCaseCount = localUseCases.length;
    
    if (feedbackCount === 0 && useCaseCount === 0) {
      return {
        status: MigrationStatus.NOT_NEEDED,
        message: 'No data to migrate',
        feedbackCount: 0,
        useCaseCount: 0
      };
    }
    
    return {
      status: MigrationStatus.PENDING,
      message: `Found ${feedbackCount} feedback items and ${useCaseCount} use cases to migrate`,
      feedbackCount,
      useCaseCount
    };
  } catch (error) {
    console.error('Error checking migration status:', error);
    return {
      status: MigrationStatus.FAILED,
      message: 'Failed to check migration status',
      error: error.message
    };
  }
}

/**
 * Migrate feedback from localStorage to database
 */
async function migrateFeedback() {
  const localFeedback = storage.getItem(STORAGE_KEYS.USER_FEEDBACK, []);
  
  if (localFeedback.length === 0) {
    return { success: true, count: 0, errors: [] };
  }
  
  const results = {
    success: true,
    count: 0,
    errors: []
  };
  
  for (let i = 0; i < localFeedback.length; i++) {
    try {
      const feedback = localFeedback[i];
      
      // Ensure all required fields are present
      const feedbackData = {
        pageName: feedback.pageName || feedback.page_name || 'Unknown',
        date: feedback.date || new Date().toISOString().split('T')[0],
        name: feedback.name || '',
        email: feedback.email || '',
        details: feedback.details || '',
        timestamp: feedback.timestamp || new Date().toISOString()
      };
      
      await feedbackAPI.create(feedbackData);
      results.count++;
    } catch (error) {
      console.error(`Error migrating feedback item ${i}:`, error);
      results.errors.push({
        index: i,
        error: error.message
      });
    }
  }
  
  if (results.errors.length > 0) {
    results.success = false;
  }
  
  return results;
}

/**
 * Migrate use cases from localStorage to database
 */
async function migrateUseCases() {
  const localUseCases = storage.getItem('useCases', []);
  
  if (localUseCases.length === 0) {
    return { success: true, count: 0, errors: [] };
  }
  
  const results = {
    success: true,
    count: 0,
    errors: []
  };
  
  for (let i = 0; i < localUseCases.length; i++) {
    try {
      const useCase = localUseCases[i];
      
      // Prepare use case data
      const useCaseData = {
        useCase: {
          id: useCase.id || `UC-${Date.now()}-${i}`,
          name: useCase.name || 'Untitled Use Case',
          status: useCase.status || 'Development',
          businessContext: useCase.businessContext || '',
          problemStatement: useCase.problemStatement || '',
          targetAudience: useCase.targetAudience || '',
          successCriteria: useCase.successCriteria || ''
        },
        kpis: useCase.kpis || [],
        dataRequirements: useCase.dataRequirements || [],
        risks: useCase.risks || [],
        stakeholders: useCase.stakeholders || [],
        milestones: useCase.milestones || []
      };
      
      await useCaseAPI.create(useCaseData);
      results.count++;
    } catch (error) {
      console.error(`Error migrating use case ${i}:`, error);
      results.errors.push({
        index: i,
        error: error.message
      });
    }
  }
  
  if (results.errors.length > 0) {
    results.success = false;
  }
  
  return results;
}

/**
 * Main migration function
 */
export async function migrateFromLocalStorage(onProgress) {
  try {
    // Check if migration is needed
    const check = await checkMigrationNeeded();
    
    if (check.status === MigrationStatus.NOT_NEEDED) {
      return {
        status: MigrationStatus.NOT_NEEDED,
        message: check.message,
        results: null
      };
    }
    
    // Report progress
    if (onProgress) {
      onProgress({
        status: MigrationStatus.IN_PROGRESS,
        message: 'Starting migration...',
        progress: 0
      });
    }
    
    // Migrate feedback
    if (onProgress) {
      onProgress({
        status: MigrationStatus.IN_PROGRESS,
        message: 'Migrating feedback...',
        progress: 25
      });
    }
    
    const feedbackResults = await migrateFeedback();
    
    // Migrate use cases
    if (onProgress) {
      onProgress({
        status: MigrationStatus.IN_PROGRESS,
        message: 'Migrating use cases...',
        progress: 50
      });
    }
    
    const useCaseResults = await migrateUseCases();
    
    // Check if migration was successful
    const success = feedbackResults.success && useCaseResults.success;
    
    if (success) {
      // Mark migration as completed
      storage.setItem('migrationCompleted', true);
      
      // Optionally backup localStorage data before clearing
      const backup = {
        feedback: storage.getItem(STORAGE_KEYS.USER_FEEDBACK, []),
        useCases: storage.getItem('useCases', []),
        backupDate: new Date().toISOString()
      };
      storage.setItem('localStorageBackup', backup);
      
      // Clear localStorage data (optional - commented out for safety)
      // storage.removeItem(STORAGE_KEYS.USER_FEEDBACK);
      // storage.removeItem('useCases');
      
      if (onProgress) {
        onProgress({
          status: MigrationStatus.COMPLETED,
          message: 'Migration completed successfully!',
          progress: 100
        });
      }
      
      return {
        status: MigrationStatus.COMPLETED,
        message: 'Migration completed successfully',
        results: {
          feedback: feedbackResults,
          useCases: useCaseResults
        }
      };
    } else {
      if (onProgress) {
        onProgress({
          status: MigrationStatus.FAILED,
          message: 'Migration completed with errors',
          progress: 100
        });
      }
      
      return {
        status: MigrationStatus.FAILED,
        message: 'Migration completed with errors',
        results: {
          feedback: feedbackResults,
          useCases: useCaseResults
        }
      };
    }
  } catch (error) {
    console.error('Migration failed:', error);
    
    if (onProgress) {
      onProgress({
        status: MigrationStatus.FAILED,
        message: `Migration failed: ${error.message}`,
        progress: 0
      });
    }
    
    return {
      status: MigrationStatus.FAILED,
      message: `Migration failed: ${error.message}`,
      error: error.message
    };
  }
}

/**
 * Clear localStorage backup after confirming database has data
 */
export function clearLocalStorageBackup() {
  storage.removeItem(STORAGE_KEYS.USER_FEEDBACK);
  storage.removeItem('useCases');
  storage.removeItem('localStorageBackup');
}

/**
 * Restore from localStorage backup (in case of issues)
 */
export function restoreFromBackup() {
  const backup = storage.getItem('localStorageBackup', null);
  
  if (!backup) {
    return {
      success: false,
      message: 'No backup found'
    };
  }
  
  storage.setItem(STORAGE_KEYS.USER_FEEDBACK, backup.feedback);
  storage.setItem('useCases', backup.useCases);
  storage.removeItem('migrationCompleted');
  
  return {
    success: true,
    message: 'Backup restored successfully',
    backupDate: backup.backupDate
  };
}
