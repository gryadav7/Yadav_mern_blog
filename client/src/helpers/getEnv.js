export function getEnv(key) {
  const value = import.meta.env[key];

  if (!value) {
    console.warn(`⚠️ Environment variable "${key}" is not defined.`);
  }

  return value;
}

