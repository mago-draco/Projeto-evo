package com.evobots

data class TerminalConfig(
    var fontSize: Float = 15f,
    var wallpaper: String = "matrix",
    var theme: String = "dark"
)

object AppConfig {
    var config = TerminalConfig()
    const val APP_NAME = "EVO"
    const val VERSION = "1.0"
}
