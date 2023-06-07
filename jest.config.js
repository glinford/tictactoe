module.exports = {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(t|j)sx?$": [
            "@swc/jest",
            {
                jsc: {
                    transform: {
                        react: {
                            runtime: "automatic",
                        },
                    },
                },
            },
        ],
    },
    testMatch: ["**/__tests__/**/*.[jt]s?(x)"],
    setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
