#!/bin/bash
GRADLE_VERSION="8.1"
GRADLE_HOME="$HOME/.gradle/gradle-$GRADLE_VERSION"
GRADLE_URL="https://services.gradle.org/distributions/gradle-$GRADLE_VERSION-bin.zip"

if [ ! -d "$GRADLE_HOME" ]; then
    echo "📥 Baixando Gradle $GRADLE_VERSION..."
    mkdir -p "$HOME/.gradle"
    cd "$HOME/.gradle"
    wget "$GRADLE_URL" 2>/dev/null || curl -O "$GRADLE_URL"
    unzip -q "gradle-$GRADLE_VERSION-bin.zip"
    rm "gradle-$GRADLE_VERSION-bin.zip"
    cd - > /dev/null
fi

# Executa Gradle no diretório correto
"$GRADLE_HOME/bin/gradle" -p "$(pwd)" "$@"
