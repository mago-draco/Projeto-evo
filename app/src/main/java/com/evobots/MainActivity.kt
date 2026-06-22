package com.evobots

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        val config = AppConfig.config
        val statusText = findViewById<TextView>(R.id.status)
        statusText.text = "EVO v${AppConfig.VERSION}\nFontSize: ${config.fontSize}\nTheme: ${config.theme}"
    }
}
